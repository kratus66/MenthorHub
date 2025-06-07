import type { Teacher } from '../types/entities';

export interface Class {
   id: string;
   title: string;
   description: string;
   createdAt: string;
   materia: {
      id: string;
      name?: string;
      imagenUrl?: string;
      descripcion?: string;
   };
   teacher: Teacher;
   students: [];
   tasks: [];
   category: {
      id: string;
      name: string;
      imageUrl: string;
      description: string;
   };
}
