import { Entity } from "typeorm";

import { Class } from "../classes/class.entity";

import { Category } from "../categorias/categorias.entity";
import { ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class Materias {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  descripcion: string;

  @Column({ nullable: true })
  imagenUrl?: string;

  @ManyToOne(() => Category, categoria => categoria.materias)
  category: Category;

  @OneToMany(() => Class, clase => clase.materia)
  clases: Class[];
}
