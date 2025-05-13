import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { Task } from '../../src/task/task.entity';
  import { User } from '../users/user.entity';
  
  @Entity()
  export class Submission {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Task, (task) => task.submissions)
    task!: Task;
  
    @ManyToOne(() => User, (user) => user.submissions)
    student!: User;
  
    @Column('text')
    content!: string; // texto, archivo o link
  
    @Column({ nullable: true })
    grade!: number;
  
    @CreateDateColumn()
    submittedAt!: Date;
  }
  