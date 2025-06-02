// src/email/email.service.ts
import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
 

  async sendEmail(to: string,Subject:string, html:string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: Subject,
      html,
    };
  
    return transporter.sendMail(mailOptions);
}
}
