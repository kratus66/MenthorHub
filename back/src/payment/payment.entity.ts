import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.payments, { eager: true })
  user!: User;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column()
  type!: 'student_subscription' | 'teacher_monthly_fee';

  @Column({ default: 'pending' })
  status!: 'pending' | 'completed' | 'failed';

  @CreateDateColumn()
  createdAt!: Date;
}
