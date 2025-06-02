import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User } from '../users/user.entity';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

    const startDate = new Date(dto.month + '-01');
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const payment = this.paymentRepo.create({
      amount,
      currency,
      type,
      paymentMethod: dto.paymentMethod,
      status: PaymentStatus.COMPLETED,
      month: dto.month,
      user,
      startDate,
      endDate,
    });

    user.isPaid = true;
    await this.userRepo.save(user);

    return await this.paymentRepo.save(payment);
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

}


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

    const payment = this.paymentRepo.create({
      amount,
      currency,
      type: user.role === 'teacher' ? PaymentType.TEACHER_SUBSCRIPTION : PaymentType.STUDENT_SUBSCRIPTION,
      paymentMethod: 'paypal',
      status: PaymentStatus.COMPLETED,
      month,
      user,
    });
const savedPayment = await this.paymentRepo.save(payment);

   
    console.log(
      `🎉 Pago guardado en BD: user=${user.email}, ` +
      `monto=${savedPayment.amount} ${savedPayment.currency}, mes=${savedPayment.month}`
    );

    await this.paymentRepo.save(payment);

    user.isPaid = true;
    await this.userRepo.save(user);
  }

  async validateUserPaid(userId: string, month: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

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
}
