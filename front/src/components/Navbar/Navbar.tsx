import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import imagenUsuario from '../../images/imagenUsuario.png'

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="bg-blue-700 text-white p-4 flex items-center justify-center relative z-50">
      
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute left-4 top-4 text-2xl md:text-3xl z-50 focus:outline-none"
        >
          {menuOpen ? '←' : '☰'}
        </button>

      
        <h1 className="text-xl md:text-3xl font-bold">MentorHub</h1>

       
        <div className="absolute right-4 top-2 flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={imagenUsuario} alt="Usuario" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm md:text-base">Nombre Apellido</p>
          </div>
        </div>
      </nav>

    
      <div
        className={`fixed top-0 left-0 h-full w-64 md:w-96 bg-blue-700 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 mt-16 flex flex-col space-y-6 text-lg md:text-2xl">
          <Link to="/usuario" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">Usuario</Link>
          <Link to="/clases" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">Clases</Link>
          <Link to="/about-us" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">About Us</Link>
        </div>
      </div>
    </>
  )
}

export default NavBar
