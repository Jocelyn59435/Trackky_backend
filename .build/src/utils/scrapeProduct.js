"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeProduct = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const scrapeProduct = async (url) => {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //get price
    const [priceElement] = await page.$x('//*[@id="p_lt_ctl11_pageplaceholder_p_lt_ctl00_wBR_P_D1_ctl00_ctl00_ctl00_ctl02_lblActualPrice"]');
    const price = await priceElement.getProperty('textContent');
    const priceText = await (price === null || price === void 0 ? void 0 : price.jsonValue());
    let priceNumber;
    if (typeof priceText === 'string') {
        priceNumber = parseFloat(priceText.replace('$', '').replace(/\s+/g, ''));
    }
    else {
        throw new Error('Failed to fetch price.');
    }
    //get image src
    const [imageElement] = await page.$x('//*[@id="slider_pi_container"]/div/div/div[3]/div[2]/a/img');
    const src = await imageElement.getProperty('src');
    let srcText = await (src === null || src === void 0 ? void 0 : src.jsonValue());
    if (typeof srcText === 'string') {
        srcText = srcText.trim();
    }
    else {
        throw new Error('Failed to fetch image src.');
    }
    //get product name
    const [nameElement] = await page.$x('//*[@id="Left-Content"]/div[4]/div/table/tbody/tr[2]/td[2]/div[2]/h1');
    const productName = await nameElement.getProperty('textContent');
    let productNameText = await (productName === null || productName === void 0 ? void 0 : productName.jsonValue());
    if (typeof productNameText === 'string') {
        productNameText = productNameText.trim();
    }
    else {
        throw new Error('Failed to fetch product name.');
    }
    sendEmail('jocelynhuang193@gmail.com', 'xinxin', productNameText, priceNumber, url, srcText);
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
exports.scrapeProduct = scrapeProduct;
const sendEmail = async (userEmail, userName, productName, productPrice, productLink, productImageUrl) => {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: userEmail,
        from: 'jocelynhuang193@outlook.com',
        subject: `${productName} Price Dropped`,
        text: `Hi ${userName}, ${productName}'s current price is ${productPrice} now, here is the link: ${productLink}.'`,
        html: `<image src = ${productImageUrl} alt = "Product Image"/>`,
    };
    try {
        await mail_1.default.send(msg);
        return true;
    }
    catch (error) {
        console.error(error.response.body ? error.response.body : error);
        return false;
    }
};
//# sourceMappingURL=scrapeProduct.js.map