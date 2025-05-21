import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Tipo del usuario
export interface User {
   id: number;
   name: string;
   email: string;
   // Otros campos opcionales si querés
}

// Tipo del contexto
interface UserContextType {
   user: User | null;
   login: (userData: User) => void;
   logout: () => void;
}

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props para el proveedor
interface UserProviderProps {
   children: ReactNode;
}

// Componente proveedor del contexto
export const UserProvider = ({ children }: UserProviderProps) => {
   const [user, setUser] = useState<User | null>(null);

   const login = (userData: User) => setUser(userData);
   const logout = () => setUser(null);

   return (
      <UserContext.Provider value={{ user, login, logout }}>
         {children}
      </UserContext.Provider>
   );
};

// Hook personalizado para acceder al contexto
export const useUser = () => {
   const context = useContext(UserContext);
   if (!context) {
      throw new Error('useUser debe usarse dentro de un <UserProvider>');
   }
   return context;
};
