import React, { useState } from "react";
import { Link } from "react-router-dom";
import imagenUsuario from "../../images/imagenUsuario.png";
import type { FiltrosType } from "../../types/FiltrosType";
import { useNavigate, useLocation } from "react-router-dom";

import { useUser } from "../../context/UserContext";
import { BiLogOut } from "react-icons/bi";

type NavBarProps = {
  onSetFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
};

const NavBar: React.FC<NavBarProps> = ({ onSetFiltros }) => {
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  
const normalizedRole = (() => {
  if (!user?.role) return null;
  const roleLower = user.role.toLowerCase();
  if (roleLower === 'alumno' || roleLower === 'student') return 'student';
  if (roleLower === 'profesor' || roleLower === 'teacher') return 'teacher';
  if (roleLower === 'admin') return 'admin';
  return null;
})();
  return (
    <>
      <nav className="bg-blue-700 p-3 h-[3.5rem] flex items-center justify-between relative z-50">
        <div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl md:text-3xl z-50 focus:outline-none"
          >
            {menuOpen ? "←" : "☰"}
          </button>

          <h1 className="text-white text-xl md:text-3xl ms-4 font-bold inline">
            MentorHub
          </h1>
        </div>
        <div className="h-full flex focus-within:border-[2px] focus-within:border-[#007AFF] rounded-full ms-[10rem] me-auto">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              onSetFiltros({ search: searchInput, category: "" });

              if (location.pathname !== "/panel") {
                navigate("/panel");
              }
              setSearchInput("");
            }}
          >
            <button
              type="submit"
              className="h-full w-[2rem] bg-white rounded-full rounded-tr-none rounded-br-none"
            >
              <img
                src="/search-icon.svg"
                alt="Buscar"
                width={30}
                height={35}
                className="ps-2"
              />
            </button>
            <input
              id="searchBar"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-full rounded-bl-none rounded-tl-none h-full px-4 w-[15rem] focus:outline-0 focus:border-0"
              placeholder="Buscar clases..."
            />
          </form>
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
              {user ? user.name : "Nombre Apellido"}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="text-white text-sm md:text-base hover:underline"
          >
            <BiLogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full w-64 md:w-96 bg-blue-700 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
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

         

{normalizedRole === 'teacher' && (
  <Link to="/clases/crear" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">
    Crear una clase
  </Link>
)}
{normalizedRole === 'student' && (
  <Link to="/clases/unirme" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">
    Unirme a una clase
  </Link>
)}
<Link
            to="/suscripcion"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-200"
          >Suscribete</Link>
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
