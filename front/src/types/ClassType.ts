export type clasesType = {
   id: string;
   title: string;
   description: string;
   createdAt: string;
   materia: {
      id: string;
      imagenUrl?: string;
      descripcion: string;
   };
   teacher: {
      id: string;
      name: string;
      email: string;
      password: string;
      role: string;
      phoneNumber: string;
      avatarId: string;
      profileImage: null;
      estudios: string;
      country: string;
      provincia: string;
      localidad: string;
      createdAt: string;
   };
   students: [];
   tasks: [];
   category: {
      id: string;
      name: string;
      imageUrl: string;
      description: string;
   };
};
