import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import imagenUsuario from '../../images/imagenUsuario.png';

const NavBar: React.FC = () => {
   const [menuOpen, setMenuOpen] = useState(false);

   return (
      <>
         <nav className="bg-blue-700 p-3 h-[3.5rem] flex items-center justify-between relative z-50">
            <div>
               <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white text-2xl md:text-3xl z-50 focus:outline-none"
               >
                  {menuOpen ? '←' : '☰'}
               </button>

               <h1 className="text-white text-xl md:text-3xl ms-4 font-bold inline">
                  MentorHub
               </h1>
            </div>
            <div className="h-full flex focus-within:border-[2px] focus-within:border-[#409BFF] rounded-full ms-[10rem] me-auto">
               <button className="h-full w-[2rem] bg-white rounded-full rounded-tr-none rounded-br-none">
                  <img
                     src="./search-icon.svg"
                     alt="Buscar"
                     width={30}
                     height={35}
                     className="ps-2"
                  />
               </button>
               <input
                  id="searchBar"
                  type="search"
                  className="rounded-full rounded-bl-none rounded-tl-none h-full px-4 w-[15rem] focus:outline-0 focus:border-0"
               />
            </div>

            <div className="right-4 top-2 flex items-center space-x-2">
               <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                     src={imagenUsuario}
                     alt="Usuario"
                     className="w-full h-full object-cover"
                  />
               </div>
               <div className="hidden sm:block">
                  <p className="text-white text-sm md:text-base">
                     Nombre Apellido
                  </p>
               </div>
            </div>
         </nav>

         <div
            className={`fixed top-0 left-0 h-full w-64 md:w-96 bg-blue-700 text-white transform transition-transform duration-300 ease-in-out z-40 ${
               menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
         >
            <div className="p-8 mt-16 flex flex-col space-y-6 text-lg md:text-2xl">
               <Link
                  to="/usuario"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-200"
               >
                  Usuario
               </Link>
               <Link
                  to="/clases"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-gray-200"
               >
                  Clases
               </Link>
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

export default NavBar;
