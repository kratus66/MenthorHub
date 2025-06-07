import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imagenUsuario from '../../images/imagenUsuario.png';
import { BiLogOut } from 'react-icons/bi';
// import { useNavigate, useLocation } from 'react-router-dom';

import { useUser } from '../../context/UserContext';

const AdminNavBar: React.FC = () => {
   const { user, logout } = useUser();
   const [menuOpen, setMenuOpen] = useState(false);
   // const [searchInput, setSearchInput] = useState('');

   const navigate = useNavigate();
   // const location = useLocation();

   return (
      <>
         <nav className="bg-[#007AFF] p-3 h-[3.5rem] flex items-center justify-between relative z-50">
            <div>
               <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white text-2xl md:text-3xl z-50 focus:outline-none"
               >
                  {menuOpen ? '←' : '☰'}
               </button>

               <h1 className="text-white text-xl md:text-3xl ms-4 font-bold inline">
                  MentorHub - ADMIN
               </h1>
            </div>

            <div className="right-4 top-2 flex items-center space-x-2">
               <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Link to="/usuario">
                     <img
                        src={user?.profileImage ?? imagenUsuario}
                        alt="Usuario"
                        className="w-full h-full object-cover"
                     />
                  </Link>
               </div>
               <div className="hidden sm:block">
                  <p className="text-white text-sm md:text-base">
                     {user ? user.name : 'Nombre Apellido'}
                  </p>
               </div>
               <button
                  onClick={() => {
                     logout();
                     navigate('/login');
                  }}
                  className="text-white text-sm md:text-base hover:underline"
                  aria-label="Cerrar sesión"
               >
                  <BiLogOut className="w-6 h-6" />
               </button>
            </div>
         </nav>

         <div
            className={`fixed top-0 left-0 h-full w-64 md:w-96 bg-[#007AFF] text-white transform transition-transform duration-300 ease-in-out z-40 ${
               menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
         >
            <div className="p-8 mt-16 flex flex-col space-y-6 text-lg md:text-2xl">
               <Link
                  to="/panel"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-200"
               >
                  Home
               </Link>

               {user?.role === 'teacher' && (
                  <Link
                     to="/clases/crear"
                     onClick={() => setMenuOpen(false)}
                     className="hover:text-gray-200"
                  >
                     Crear una clase
                  </Link>
               )}
               {user?.role === 'student' && (
                  <Link
                     to="/clases/unirme"
                     onClick={() => setMenuOpen(false)}
                     className="hover:text-gray-200"
                  >
                     Unirme a una clase
                  </Link>
               )}

               <Link
                  to="/about-us"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-200"
               >
                  About Us
               </Link>
            </div>
         </div>
      </>
   );
};

export default AdminNavBar;
