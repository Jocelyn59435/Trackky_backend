import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
import { emailMessageType } from '../types';

dotenv.config();
//non-null-assertion
const email: string = process.env.EMAIL!;
const password: string = process.env.EMAIL_PASSWORD!;

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(emailMessage: emailMessageType): Promise<void> {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodeMailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: email,
      pass: password,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail(emailMessage);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
