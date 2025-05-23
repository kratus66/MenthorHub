    // src/email/email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const response = await this.resend.emails.send({
        from: 'MentorHub <onboarding@resend.dev>', // puedes personalizar el nombre
        to: ['delivered@resend.dev'], // ✅ usar el valor recibido por parámetro
        subject,
        html,
      });
  
      console.log('✅ RESPUESTA DE RESEND:', response);
    } catch (error: any) {
      console.error('❌ ERROR DE RESEND:', error.response?.data || error.message);
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }
  
}
