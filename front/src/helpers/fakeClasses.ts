import type { Category, Class, Professor, Task, User } from '../types/entities';

const sampleClasses: Class[] = [
   {
      id: '1a2b3c4d-0001',
      title: 'Introducción a la Programación',
      description:
         'Aprende los conceptos básicos de programación con JavaScript.',
      teacher: { id: 'prof-001', name: 'Juan Pérez' } as Professor,
      students: [
         { id: 'user-101', name: 'Ana' },
         { id: 'user-102', name: 'Carlos' },
      ] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-01', name: 'Tecnología' } as Category,
      createdAt: new Date('2024-09-01T09:00:00'),
   },
   {
      id: '1a2b3c4d-0002',
      title: 'Historia del Arte',
      description:
         'Estudia las principales corrientes artísticas desde el Renacimiento hasta hoy.',
      teacher: { id: 'prof-002', name: 'María López' } as Professor,
      students: [
         { id: 'user-103', name: 'Lucía' },
         { id: 'user-104', name: 'Jorge' },
      ] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-02', name: 'Humanidades' } as Category,
      createdAt: new Date('2024-09-02T10:00:00'),
   },
   {
      id: '1a2b3c4d-0003',
      title: 'Matemática Financiera',
      description: 'Conocé cómo aplicar fórmulas financieras en el mundo real.',
      teacher: { id: 'prof-003', name: 'Carlos Sánchez' } as Professor,
      students: [{ id: 'user-105', name: 'Matías' }] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-03', name: 'Economía' } as Category,
      createdAt: new Date('2024-09-03T11:00:00'),
   },
   {
      id: '1a2b3c4d-0004',
      title: 'Física Cuántica Básica',
      description:
         'Una introducción accesible a los fundamentos de la física moderna.',
      teacher: { id: 'prof-004', name: 'Sofía Martínez' } as Professor,
      students: [] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-01', name: 'Tecnología' } as Category,
      createdAt: new Date('2024-09-04T12:00:00'),
   },
   {
      id: '1a2b3c4d-0005',
      title: 'Literatura Contemporánea',
      description: 'Análisis de obras destacadas del siglo XXI.',
      teacher: { id: 'prof-005', name: 'Germán Díaz' } as Professor,
      students: [
         { id: 'user-106', name: 'Valentina' },
         { id: 'user-107', name: 'Martín' },
         { id: 'user-108', name: 'Florencia' },
      ] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-02', name: 'Humanidades' } as Category,
      createdAt: new Date('2024-09-05T13:00:00'),
   },
   {
      id: '1a2b3c4d-0006',
      title: 'Biología Marina',
      description: 'Explora los ecosistemas marinos y su biodiversidad.',
      teacher: { id: 'prof-006', name: 'Ignacio Suárez' } as Professor,
      students: [{ id: 'user-109', name: 'Camila' }] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-04', name: 'Ciencias Naturales' } as Category,
      createdAt: new Date('2024-09-06T14:00:00'),
   },
   {
      id: '1a2b3c4d-0007',
      title: 'Fotografía Digital',
      description:
         'Técnicas y herramientas para capturar imágenes impactantes.',
      teacher: { id: 'prof-007', name: 'Laura Torres' } as Professor,
      students: [] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-05', name: 'Arte' } as Category,
      createdAt: new Date('2024-09-07T15:00:00'),
   },
   {
      id: '1a2b3c4d-0008',
      title: 'Cocina Internacional',
      description: 'Prepará platos de distintas partes del mundo.',
      teacher: { id: 'prof-008', name: 'Diego Rodríguez' } as Professor,
      students: [
         { id: 'user-110', name: 'Federico' },
         { id: 'user-111', name: 'Laura' },
      ] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-06', name: 'Gastronomía' } as Category,
      createdAt: new Date('2024-09-08T16:00:00'),
   },
   {
      id: '1a2b3c4d-0009',
      title: 'Diseño UX/UI',
      description:
         'Aprende los principios clave para crear interfaces efectivas.',
      teacher: { id: 'prof-009', name: 'Andrea Gómez' } as Professor,
      students: [
         { id: 'user-112', name: 'Bruno' },
         { id: 'user-113', name: 'Julieta' },
      ] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-01', name: 'Tecnología' } as Category,
      createdAt: new Date('2024-09-09T17:00:00'),
   },
   {
      id: '1a2b3c4d-0010',
      title: 'Psicología del Desarrollo',
      description: 'Un recorrido por las etapas del crecimiento humano.',
      teacher: { id: 'prof-010', name: 'Ricardo Herrera' } as Professor,
      students: [{ id: 'user-114', name: 'Sabrina' }] as User[],
      tasks: [] as Task[],
      category: { id: 'cat-07', name: 'Psicología' } as Category,
      createdAt: new Date('2024-09-10T18:00:00'),
   },
];

export default sampleClasses;
