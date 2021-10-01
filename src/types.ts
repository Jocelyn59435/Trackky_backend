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
