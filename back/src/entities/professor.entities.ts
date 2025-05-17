import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// ✅ Cambio 1: Se usa `type` para evitar errores de metadatos circulares
import { Class } from '../classes/class.entity';
console.log('✅ Professor entity loaded'); // <-- Agrega al principio del archivo

@Entity()
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio?: string;

  // ✅ Cambio 2: Ajuste en OneToMany para especificar tipo y propiedad inversa
  @OneToMany(() => Class, (cls: Class) => cls.teacher, {
    cascade: false, // ✅ por defecto, desactiva creación automática de clases
  })
  classes: Class[];
}

