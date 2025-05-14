import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './Category';
import { Professor } from './proffesor';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.classes)
  category: Category;

  @ManyToOne(() => Professor, (professor) => professor.classes)
  professor: Professor;
}