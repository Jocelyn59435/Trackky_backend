import pt from 'puppeteer';
import { sendEmail } from './sendEmail';
import { emailMessageType } from '../types';
import { db } from '../index';

const updateCurrentPrice = async (
  userId: string,
  productId: string,
  productLink: string,
  desired_price: number
): Promise<void> => {
  const browser = await pt.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(productLink, { waitUntil: 'load', timeout: 0 });

  //get price
  const [priceElement] = await page.$x(
    '//*[@id="p_lt_ctl11_pageplaceholder_p_lt_ctl00_wBR_P_D1_ctl00_ctl00_ctl00_ctl02_lblActualPrice"]'
  );
  const price = await priceElement.getProperty('textContent');
  const priceText: string | undefined = await price?.jsonValue();
  let priceNumber: number | undefined;
  if (typeof priceText === 'string') {
    priceNumber = parseFloat(priceText.replace('$', '').replace(/\s+/g, ''));
  } else {
    throw new Error('Failed to fetch price.');
  }

  //if current price is lower than desired price, send price drop email
  if (priceNumber <= desired_price) {
    try {
      const [product] = await db('product').where({
        id: parseInt(productId),
        user_id: parseInt(userId),
      });
      if (!product) {
        throw new Error('Product not found.');
      }
      const [user] = await db('user_info').where({
        user_id: parseInt(userId),
      });
      if (!user) {
        throw new Error('User not found.');
      }

      const emailMessage: emailMessageType = {
        from: 'trackky@outlook.com', // sender address
        to: user.email, // list of receivers
        subject: `Price Drop Alert: ${product.product_name}`, // Subject line
        html: `<p>Hi ${user.first_name},</p>
           <p>Congrats! Time to enjoy the price drop:</p>
           <a href = "${productLink}"><image src=${product.product_image_src} /></a>
           <p>Current price is $ ${priceNumber}</p>
           <br>
           <p>Thank you.</p>
           <p>Trackky</p>`,
      };

      sendEmail(emailMessage);
      // update email_sent_time
      const [updatedProduct] = await db('product')
        .where('id', productId)
        .update(
          {
            email_sent_time: Date.now(),
          },
          ['id']
        );
      if (!updatedProduct) {
        throw new Error('Fail to update email_sent_time.');
      }
    } catch (e) {
      console.log('Error from updateCurrentPrice(): ' + e.message);
    }
  }
  // if current price is higher than desired price, update the price and updated time
  const [updatedProduct] = await db('product').where('id', productId).update(
    {
      price_update_time: Date.now(),
      current_price: priceNumber,
    },
    ['id']
  );
  if (!updatedProduct) {
    throw new Error('Fail to update current_price.');
  }
};

export const updateAllProducts = async (): Promise<void> => {
  try {
    const products = await db('product').columns('*');
    if (!products) {
      throw new Error('Failed to fetch products.');
    }
    products.forEach((p) => {
      updateCurrentPrice(p.user_id, p.id, p.product_link, p.desired_price);
    });
  } catch (e) {
    console.log('Errors from updateAllProducts' + e.message);
  }
};
