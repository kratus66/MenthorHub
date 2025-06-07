import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../task/task.entity';
import { Materias } from '../materias/materias.entity';
import { Category } from '../categorias/categorias.entity';
import { Review } from '../review/review.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column('text', { array: true, nullable: true })
  multimedia!: string[];

  @ManyToOne(() => User, (user) => user.classesTaught, { nullable: false })
  teacher!: User;
  
  @ManyToMany(() => User, (user) => user.classesEnrolled)
  @JoinTable()
  students!: User[];

  @OneToMany(() => Task, (task) => task.classRef)
  tasks!: Task[];

  @ManyToOne(() => Materias, { eager: true, nullable: true })
  @JoinColumn()
  materia: Materias;

  @ManyToOne(() => Category, (categoria) => categoria.clases, {
    eager: false,
    nullable: false,  
  })
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: true })
  estado!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaEliminado?: Date | null;

  @Column({ default: false })
  isDeleted!: boolean;

  @OneToMany(() => Review, (review) => review.course)
  reviews!: Review[];
}
