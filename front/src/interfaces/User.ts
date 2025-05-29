export interface User {
   id?: string;
   name?: string;
   email?: string;
   role?: string;
   phoneNumber?: string;
   avatarId?: number;
   profileImage?: string;
   estudios?: 'Primario' | 'Secundario' | 'Universitario' | '';
   country?: string;
   provincia?: string;
   localidad?: string;
   estado?: boolean;
   fechaCambioEstado?: string | null;
   createdAt?: string;
   isEmailConfirmed?: boolean;
   isOauth?: boolean;
   isPaid?: boolean;
}
