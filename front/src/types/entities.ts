// types/entities.ts

import type { CategoryType } from './CategoryType';

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
   category: CategoryType;
   materia: string;
   createdAt: string;
}

export interface Teacher {
   id: string;
   name: string;
   email: string;
   role: string;
   phoneNumber: string;
   avatarId: string;
   profileImage: null;
   estudios: string;
   country: string;
   provincia: string;
   localidad: string;
   createdAt: string;
}
