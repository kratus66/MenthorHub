// types/entities.ts

import type { Categoria } from './Categoria';

export interface Professor {
   id: string;
   name: string;
}

export interface User {
   id: string;
   name: string;
   email: string;
}

export interface Task {
   id: string;
   title: string;
   dueDate: Date;
}

export interface Class {
   id: string;
   title: string;
   description: string;
   teacher: Professor;
   students: User[];
   tasks: Task[];
   category: Categoria;
   materia: string;
   createdAt: Date;
}
