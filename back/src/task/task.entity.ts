import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Class } from '../classes/class.entity';
import { Submission } from '../submission/submission.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  instructions!: string;

  @Column({ type: 'timestamp' })
  dueDate!: Date;

  @ManyToOne(() => Class, (cls) => cls.tasks)
  classRef!: Class;

  @OneToMany(() => Submission, (submission) => submission.task)
  submissions!: Submission[];

  @CreateDateColumn()
  createdAt!: Date;
}
