import type { Review } from '../interfaces/Review';
import type { Teacher } from './entities';

export type clasesType = {
   id: string;
   title: string;
   description: string;
   createdAt: string;
   materia: {
      id: string;
      name?: string;
      imagenUrl?: string;
   };
   teacher: Teacher;
   students: []; // Especificado como array de objetos con id
   tasks: []; // Puedes definir un tipo más específico si lo tienes
   category: {
      id: string;
      name: string;
      imageUrl: string;
      description: string;
   };
   reviews: Review[];
   multimedia: Array<{
      url: string;
      type?: string; // Opcional: 'image', 'video', etc.
      // podrías añadir más propiedades como title, description si es necesario
   }>;
};
