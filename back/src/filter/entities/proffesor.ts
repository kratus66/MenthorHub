// src/professors/entities/professor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Class } from './filterClass';

@Entity()
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio?: string;

  @OneToMany(() => Class, (classItem) => classItem.professor)
  classes: Class[];
}
