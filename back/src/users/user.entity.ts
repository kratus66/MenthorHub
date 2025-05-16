import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Class } from '../classes/class.entity';
import { Submission } from '../submission/submission.entity';
import { Payment } from '../payment/payment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'student' })
  role!: 'admin' | 'teacher' | 'student';

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  country?: string;

  @OneToMany(() => Class, (cls) => cls.teacher)
  classesTaught!: Class[];



  @ManyToMany(() => Class, (cls) => cls.students)
  @JoinTable()
  classesEnrolled!: Class[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions!: Submission[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;
}


