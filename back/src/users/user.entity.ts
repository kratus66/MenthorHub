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
import { Task } from '../task/task.entity';
import { Notification } from '../notifications/notification.entity';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Review } from '../review/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ default: 'student' })
  role!: 'admin' | 'teacher' | 'student';

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  avatarId?: number;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  estudios?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  provincia?: string;

  @Column({ nullable: true })
  localidad?: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaCambioEstado?: Date;

  @OneToMany(() => Class, (cls) => cls.teacher)
  classesTaught!: Class[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions!: Submission[];

  // @OneToMany(() => Task, (task) => task.student)
  // tasks!: Task[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ default: false })
  isOauth: boolean;

  @Column({ default: false })
  isPaid: boolean;

  @OneToMany(() => Review, (review) => review.author)
  reviewsGiven: Review[];

  @OneToMany(() => Review, (review) => review.targetStudent)
  reviewsReceived: Review[];

  @ManyToMany(() => Class, (cls) => cls.students)
  classesEnrolled!: Class[];

  @Column({ type: 'text', nullable: true })
  description?: string;

}
