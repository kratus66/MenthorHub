// src/submission/submission.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Task } from '../task/task.entity';
import { User } from '../users/user.entity';


@Entity()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string ;

  @Column()
  content: string; // Puede ser un texto, URL o ruta al archivo

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task, (task) => task.submissions, { eager: true })
  task: Task;

  @ManyToOne(() => User, (user) => user.submissions, { eager: true })
  student: User;
}
