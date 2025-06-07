// src/email/email.service.ts
import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPaymentConfirmationEmail(to: string, paymentInfo: any) {
    const { startDate, endDate, amount, currency, message } = paymentInfo;
  
    const html = `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f4f9ff; color: #333; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <div style="text-align: center;">
          <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Pago Confirmado" width="100" style="margin-bottom: 20px;" />
        </div>
        <h2 style="color: #2a70c9; text-align: center;">¡Pago confirmado!</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          ${message || 'Tu pago ha sido registrado y la orden ha sido capturada correctamente.'}
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Detalles de tu suscripción:
        </p>
        <ul style="font-size: 16px; color: #555;">
          <li><strong>Fecha de inicio:</strong> ${new Date(startDate).toLocaleDateString()}</li>
          <li><strong>Fecha de fin:</strong> ${new Date(endDate).toLocaleDateString()}</li>
          <li><strong>Monto pagado:</strong> ${amount} ${currency}</li>
        </ul>
        <p style="font-size: 14px; color: #555;">
          Si no reconoces este pago, por favor contáctanos inmediatamente.
        </p>
        <p style="font-size: 14px; color: #555; margin-top: 30px;">
          Saludos,<br />
          <strong>El equipo de MentorHub</strong>
        </p>
      </div>
    `;
  
    return this.sendEmail(to, 'Confirmación de pago - MentorHub', html);
  }
  

  private buildPaymentConfirmationHtml(paymentInfo: any): string {
    return `
      <h2>Confirmación de pago</h2>
      <p><strong>Mensaje:</strong> ${paymentInfo.message}</p>
      <p><strong>Fecha inicio:</strong> ${new Date(paymentInfo.startDate).toLocaleDateString()}</p>
      <p><strong>Fecha fin:</strong> ${new Date(paymentInfo.endDate).toLocaleDateString()}</p>
      <p><strong>Monto:</strong> ${paymentInfo.amount} ${paymentInfo.currency}</p>
      <p><strong>ID de captura:</strong> ${paymentInfo.captureRes?.id || 'N/A'}</p>
      <p><strong>Estado:</strong> ${paymentInfo.captureRes?.status || 'N/A'}</p>
    `;
  }
}
