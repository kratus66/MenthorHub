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
   students: [];
   tasks: [];
   category: {
      id: string;
      name: string;
      imageUrl: string;
      description: string;
   };
   reviews: Review[];
};
