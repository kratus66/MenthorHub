import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class Submission {
 @PrimaryGeneratedColumn('uuid')
id!: string;

  @Column()
  content: string; // Puede ser texto o una URL (archivo)

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.submissions, { eager: true })
  student: User;

  @ManyToOne(() => Task, (task) => task.submissions, { eager: true })
  task: Task;

  @Column({ type: 'int', nullable: true }) // <--- MODIFICADO: Especifica el tipo de base de datos
  grade: number | null; // Mantiene el tipo de TypeScript para aceptar null

  @Column({ nullable: true })
  feedback?: string;

  @Column({ default: false })
  isGraded: boolean;

  @Column({ default: true })
estado!: boolean;

@Column({ type: 'timestamp', nullable: true })
fechaEliminado?: Date | null;

}
