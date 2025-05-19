// types/entities.ts

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

export interface Category {
   id: string;
   name: string;
}

export interface Class {
   id: string;
   title: string;
   description: string;
   teacher: Professor;
   students: User[];
   tasks: Task[];
   category: Category;
   createdAt: Date;
}
