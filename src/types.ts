// {
//     from: 'trackky@outlook.com', // sender address
//     to: 'jocelynhuang193@gmail.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world?', // plain text body
//     html: '<b>Hello world?</b>', // html body
//   }

export type emailMessageType = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type ProductInfo = {
  product_name: string | undefined;
  product_link: string;
  product_image_src: string | undefined;
  platform?: string;
  status?: string;
  original_price: number | undefined;
  current_price?: number | undefined;
};
