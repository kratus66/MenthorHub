// front/src/types/ClassType.ts
export type ClassType = {
  id: string;
  title: string;
  description: string;
  teacher: { id: string; name: string };
  category: { id: string; name: string };
};
