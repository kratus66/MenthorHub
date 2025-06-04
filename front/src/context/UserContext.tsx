import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../interfaces/User';
// Tipo del usuario

interface UserContextType {   
   user: User | null;
   token: string | null;
   login: (userData: User, token: string) => void;
   logout: () => void;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
   refreshUser: () => Promise<void>;
} 

const UserContext = createContext<UserContextType | undefined>(undefined);
interface UserProviderProps {
   children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);

   // Recuperar usuario y token desde localStorage al iniciar
   useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
         setUser(JSON.parse(storedUser));
         setToken(storedToken);
      }
   }, []);
   const login = (userData: User, receivedToken: string) => {
      setUser(userData);
      setToken(receivedToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', receivedToken);
   };
   const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
   };
const refreshUser = async () => {
  try {
    const res = await fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const updatedUser = await res.json();

      // Forzar valor default si no existe
      if (updatedUser.isPaid === undefined) {
        updatedUser.isPaid = false;
      }

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  } catch (err) {
    console.error('Error al refrescar el usuario:', err);
  }
};

   return (
      <UserContext.Provider value={{ user, setUser, token, login, logout, refreshUser }}>
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
