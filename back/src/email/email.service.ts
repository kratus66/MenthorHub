// src/email/email.service.ts
import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendWelcomeEmail(to: string,Subject:string, html:string) {
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
      Subject,
      html,
    };
  
    return transporter.sendMail(mailOptions);
}
}
