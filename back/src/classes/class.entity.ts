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
import { Professor } from '../entities/professor.entities'; // ✅ Importación directa

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  // ✅ Usa función de tipo para evitar errores de metadatos circulares
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
}

