// payment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { CreateDateColumn } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PaymentType {
  MONTHLY = 'monthly',
  ONE_TIME = 'one_time',
  STUDENT_SUBSCRIPTION = 'student_subscription',
  TEACHER_SUBSCRIPTION = 'teacher_monthly_fee',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column()
  paymentMethod: string;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column()
  month: string; // formato: 'YYYY-MM'

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @CreateDateColumn()
createdAt: Date;

}
