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

@Entity()   
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable:false})
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

  @OneToMany(() => Class, (cls) => cls.teacher)
  classesTaught!: Class[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @ManyToMany(() => Class, (cls) => cls.students)
  @JoinTable()
  classesEnrolled!: Class[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions!: Submission[];

  @OneToMany(() => Task, (task) => task.student)
  tasks!: Task[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt!: Date;
}

