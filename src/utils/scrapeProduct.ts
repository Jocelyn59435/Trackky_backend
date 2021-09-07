import pt from 'puppeteer';
import sgMail from '@sendgrid/mail';

type productInfo = {
  productName: string | undefined;
  productPrice: number | undefined;
  productImageUrl: string | undefined;
};

type message = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export const scrapeProduct = async (url: string): Promise<productInfo> => {
  const browser = await pt.launch();
  const page = await browser.newPage();
  await page.goto(url);

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

  //get image src
  const [imageElement] = await page.$x(
    '//*[@id="slider_pi_container"]/div/div/div[3]/div[2]/a/img'
  );
  const src = await imageElement.getProperty('src');
  let srcText: string | undefined = await src?.jsonValue();
  if (typeof srcText === 'string') {
    srcText = srcText.trim();
  } else {
    throw new Error('Failed to fetch image src.');
  }

  //get product name
  const [nameElement] = await page.$x(
    '//*[@id="Left-Content"]/div[4]/div/table/tbody/tr[2]/td[2]/div[2]/h1'
  );
  const productName = await nameElement.getProperty('textContent');
  let productNameText: string | undefined = await productName?.jsonValue();
  if (typeof productNameText === 'string') {
    productNameText = productNameText.trim();
  } else {
    throw new Error('Failed to fetch product name.');
  }

  sendEmail(
    'jocelynhuang193@gmail.com',
    'xinxin',
    productNameText,
    priceNumber,
    url,
    srcText
  );

  return {
    productName: productNameText,
    productPrice: priceNumber,
    productImageUrl: srcText,
  };
};

const sendEmail = async (
  userEmail: string,
  userName: string,
  productName: string,
  productPrice: number,
  productLink: string,
  productImageUrl: string
): Promise<boolean> => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  const msg: message = {
    to: userEmail,
    from: 'jocelynhuang193@outlook.com', // Use the email address or domain you verified above
    subject: `${productName} Price Dropped`,
    text: `Hi ${userName}, ${productName}'s current price is ${productPrice} now, here is the link: ${productLink}.'`,
    html: `<image src = ${productImageUrl} alt = "Product Image"/>`,
  };
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error(error.response.body ? error.response.body : error);
    return false;
  }
};
