import pt from 'puppeteer';
import { ProductInfo } from '../types';

const scrapeProduct = async (url: string): Promise<ProductInfo> => {
  const browser = await pt.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 0 });

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

  return {
    product_name: productNameText,
    product_link: url,
    product_image_src: srcText,
    platform: 'Chemist Warehouse',
    status: 'active',
    original_price: priceNumber,
    current_price: priceNumber,
  };
};

export default scrapeProduct;
