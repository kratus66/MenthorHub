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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'student' }) // 'admin', 'teacher', 'student'
  role!: 'admin' | 'teacher' | 'student';

  @OneToMany(() => Class, (cls) => cls.teacher)
  classesTaught!: Class[];

  @ManyToMany(() => Class, (cls) => cls.students)
  @JoinTable()
  classesEnrolled!: Class[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions!: Submission[];

  @CreateDateColumn()
  createdAt!: Date;
}
