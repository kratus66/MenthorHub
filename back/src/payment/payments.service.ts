import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: number, dto: CreatePaymentDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const payment = this.paymentRepo.create({ ...dto, user, status: 'completed' }); // aquí simulas que siempre se completa
    return await this.paymentRepo.save(payment);
  }

  async findByUser(userId: number) {
    return this.paymentRepo.find({ where: { user: { id: userId } } });
  }

  async findAll() {
    return this.paymentRepo.find();
  }
}
