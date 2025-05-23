    import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
    import { Materias } from '../materias/materias.entity';
    import { Class } from '../classes/class.entity';
    @Entity()
    export class Category {
      @PrimaryGeneratedColumn('uuid')
      id: string;
    
      @Column()
      name: string;
    
      @Column({ nullable: true })
      imageUrl?: string;
      
      @Column({ nullable: true })
      description?: string;

      @OneToMany(() => Materias, materia => materia.category)
      materias: Materias[];

      @OneToMany(() => Class, clase => clase.category)
      clases: Class[];
    }