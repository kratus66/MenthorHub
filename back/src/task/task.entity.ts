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
import { User } from '../users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title!: string;

  @Column('text')
  instructions!: string;

  @Column({ type: 'timestamp' })
  dueDate!: Date;

  @Column({ default: 'pending' })
  status!: string;

  @ManyToOne(() => Class, (cls) => cls.tasks)
  classRef!: Class;

  // @ManyToOne(() => User, (user) => user.createdTasks, { eager: true })
  // teacher!: User; // profesor que crea la tarea

  @OneToMany(() => Submission, (submission) => submission.task)
  submissions!: Submission[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: true })
  estado!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaEliminado?: Date | null;

  @Column({ default: false })
  FreeServicesUses: boolean;
}
