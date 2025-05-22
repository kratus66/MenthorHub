import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../task/task.entity';
import { Category } from '../entities/categorias.entities';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  materia!: string;

  @Column()
  sector!: string;

  @Column('text', { array: true, nullable: true })
  multimedia!: string[];

  @ManyToOne(() => User, (user) => user.classesTaught, { nullable: false })
  teacher!: User;

  @ManyToMany(() => User, (user) => user.classesEnrolled)
  @JoinTable()
  students!: User[];

  @OneToMany(() => Task, (task) => task.classRef)
  tasks!: Task[];

  @ManyToOne(() => Category, (category) => category.classes, {
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

}


