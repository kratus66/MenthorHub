import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User } from '../users/user.entity';
import { EmailService } from '../email/email.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService, // <--- Asegúrate de inyectarlo
  ) {}

  async create(userId: string, dto: CreatePaymentDto): Promise<Payment> {
    console.log('📥 DTO recibido en payment.create:', dto);
    console.log('🔑 userId recibido:', userId);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const amount = 5.99;
    const currency = 'USD';

    const type: PaymentType =
      user.role === 'student'
        ? PaymentType.STUDENT_SUBSCRIPTION
        : user.role === 'teacher'
        ? PaymentType.TEACHER_SUBSCRIPTION
        : (dto.type as PaymentType);

    // ✅ BLOQUE NUEVO
    const startDate = new Date();          // instante exacto en UTC
    const endDate = new Date(startDate);   // copia
    endDate.setMonth(endDate.getMonth() + 1);

    const month = `${startDate.getUTCFullYear()}-${String(
      startDate.getUTCMonth() + 1
    ).padStart(2, '0')}`;

    const payment = this.paymentRepo.create({
      amount,
      currency,
      type,
      paymentMethod: dto.paymentMethod,
      status: PaymentStatus.COMPLETED,
      month, // <--- aquí usas el mes calculado
      user,
      startDate,
      endDate,
    });

    user.isPaid = true;
    await this.userRepo.save(user);
 
    
    const relatedPayment = await this.paymentRepo.save(payment);
    const result = await this.emailService.sendEmail(
      user.email,
      "✅ Confirmación de pago en MentorHub",
      `
        <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f4f9ff; color: #333; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <div style="text-align: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Pago confirmado" width="80" style="margin-bottom: 20px;" />
          </div>
          <h2 style="color: #2a70c9; text-align: center;">¡Hola ${user.name}, tu pago fue exitoso!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Gracias por completar tu pago mediante <strong>PayPal</strong>. Tu suscripción está ahora activa para el mes de <strong>${payment.month}</strong>.
          </p>
          <div style="background-color: #ffffff; padding: 15px 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 0 5px rgba(0,0,0,0.05);">
            <p style="margin: 0;"><strong>Monto:</strong> ${amount} ${currency}</p>
            <p style="margin: 0;"><strong>Usuario:</strong> ${user.email}</p>
            <p style="margin: 0;"><strong>Rol:</strong> ${user.role === "teacher" ? "Docente" : "Estudiante"}</p>
            <p style="margin: 0;"><strong>Mes:</strong> ${payment.month}</p>
          </div>
          <p style="font-size: 14px; color: #555;">
            Puedes acceder a todas las funcionalidades premium desde tu panel de usuario. Si tienes dudas, contáctanos.
          </p>
          <p style="font-size: 14px; color: #555; margin-top: 30px;">
            ¡Gracias por ser parte de MentorHub!<br>
            <strong>El equipo de MentorHub</strong>
          </p>
        </div>
      `
    );
    return relatedPayment;
  }

  async simulatePaypal(dto: CreatePaymentDto): Promise<string> {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');

    const { data: tokenRes } = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const amount = 5.99;
    const currency = 'USD';

    const { data: paymentRes } = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: 'http://localhost:4173/suscripcion',
          cancel_url: 'http://localhost:4173/suscripcion?cancel=true',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${(tokenRes as any).access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const approvalUrl = (paymentRes as any).links.find((link: any) => link.rel === 'approve')?.href;
    if (!approvalUrl) throw new Error('No se pudo obtener la URL de aprobación');

    return approvalUrl;
  }

  async registerPaypalPayment(payerEmail: string, amount: number, currency: string, month: string) {
    const sandboxEmailMap: Record<string, string> = {
      // Mapea tu correo sandbox al correo real del usuario registrado
      // Ejemplo:
      // 'sb-xxxxxxxxxxx@personal.example.com': 'usuario.real@example.com'
    };

    const realEmail = sandboxEmailMap[payerEmail] || payerEmail;
    const user = await this.userRepo.findOne({ where: { email: realEmail } });
    if (!user) throw new NotFoundException('Usuario no encontrado para el pago PayPal');

    // 1️⃣  FECHAS REALES
    const startDate = new Date();           // ahora UTC
    const endDate   = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // 2️⃣  RECALCULA MES
    month = `${startDate.getUTCFullYear()}-${String(startDate.getUTCMonth()+1).padStart(2,'0')}`;

    // 3️⃣  CREA PAGO (mantén user)
    const payment = this.paymentRepo.create({
      amount,
      currency,
      type: user.role === 'teacher' ? PaymentType.TEACHER_SUBSCRIPTION : PaymentType.STUDENT_SUBSCRIPTION,
      paymentMethod: 'paypal',
      status: PaymentStatus.COMPLETED,
      month,
      user,         // necesario para la FK
      startDate,    // fechas reales
      endDate,
    });

    // 4️⃣  GUARDA SOLO UNA VEZ
    const savedPayment = await this.paymentRepo.save(payment);
    console.log(`🎉 Pago guardado: ${savedPayment.startDate}–${savedPayment.endDate}`);

    user.isPaid = true;
    await this.userRepo.save(user);

    // Enviar correo de confirmación (si aplica)
  }

  async validateUserPaid(userId: string, month: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Permite si el usuario tiene isPaid (flag global después de un pago)
    if (user.isPaid) return;

    // O si existe pago completado del mes
    const payment = await this.paymentRepo.findOne({
      where: {
        user: { id: userId },
        month,
        status: PaymentStatus.COMPLETED,
      },
    });

    if (!payment) {
      throw new ForbiddenException('Debes tener la suscripción al día para realizar esta acción.');
    }
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.paymentRepo.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.paymentRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepo.preload({ id, ...dto });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return await this.paymentRepo.save(payment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Pago no encontrado');
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async savePayment(data: Partial<Payment>) {
    const payment = this.paymentRepo.create(data);
    return await this.paymentRepo.save(payment);
  }

  async saveUser(user: User) {
    return await this.userRepo.save(user);
  }
  async getUserById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
