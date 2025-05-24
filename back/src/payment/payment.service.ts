import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User } from '../users/user.entity';

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

    const existing = await this.paymentRepo.findOne({
      where: {
        user: { id: userId },
        month: dto.month,
      },
    });
    if (existing)
      throw new Error(`Ya existe un pago para el mes ${dto.month}`);

    if (dto.paymentMethod === 'paypal') {
      console.log('Simulando proceso de pago con PayPal...');
    } else if (dto.paymentMethod === 'card') {
      console.log('Simulando proceso de pago con tarjeta...');
    }

    const type: PaymentType =
      user.role === 'student'
        ? PaymentType.STUDENT_SUBSCRIPTION
        : user.role === 'teacher'
        ? PaymentType.TEACHER_SUBSCRIPTION
        : (dto.type as PaymentType);

    const payment = this.paymentRepo.create({
      amount: dto.amount,
      currency: dto.currency,
      type: type,
      paymentMethod: dto.paymentMethod,
      status: PaymentStatus.COMPLETED,
      month: dto.month,
      user: user,
    });

    user.isPaid = true;
    await this.userRepo.save(user);

    return await this.paymentRepo.save(payment);
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { user: { id: userId } },
    });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find();
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const updateData: Partial<Payment> = {};

    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.currency !== undefined) updateData.currency = dto.currency;
    if (dto.type) updateData.type = dto.type;
    if (dto.status) updateData.status = dto.status;
    if (dto.paymentMethod) updateData.paymentMethod = dto.paymentMethod;
    if (dto.month) updateData.month = dto.month;

    const payment = await this.paymentRepo.preload({
      id,
      ...updateData,
    });

    if (!payment) throw new NotFoundException('Pago no encontrado');
    return await this.paymentRepo.save(payment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Pago no encontrado');
  }
}
