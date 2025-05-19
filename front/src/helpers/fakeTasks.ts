import type { Task } from '../types/entities';

export const fakeTasks: Task[] = [
   {
      id: 'task-001',
      title: 'Resolver ecuaciones',
      dueDate: new Date('2025-06-01'),
   },
   {
      id: 'task-002',
      title: 'Ensayo sobre la Revolución Francesa',
      dueDate: new Date('2025-06-03'),
   },
];
