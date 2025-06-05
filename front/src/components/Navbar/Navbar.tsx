import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import imagenUsuario from "../../images/imagenUsuario.png";
import type { FiltrosType } from "../../types/FiltrosType";
import { useUser } from "../../context/UserContext";
import { BiLogOut } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import axiosInstance from "../../services/axiosInstance";

type NotificationType = {
  id?: string;
  message: string;
  createdAt: string;
};

type NavBarProps = {
  onSetFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
};

const NavBar: React.FC<NavBarProps> = ({ onSetFiltros }) => {
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  // State specifically for the badge count on the bell icon
  const [notificationBadgeCount, setNotificationBadgeCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const normalizedRole = React.useMemo(() => {
    if (!user?.role) return null;
    const roleLower = user.role.toLowerCase();
    if (roleLower === "alumno" || roleLower === "student") return "student";
    if (roleLower === "profesor" || roleLower === "teacher") return "teacher";
    if (roleLower === "admin") return "admin";
    return null;
  }, [user?.role]);

  const fetchNotificationsCallback = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setNotificationBadgeCount(0); // Clear badge if no user
      setLoadingNotifications(false);
      return;
    }
    setLoadingNotifications(true);
    try {
      const res = await axiosInstance.get<NotificationType[]>(
        `/notifications/${user.id}`
      );
      setNotifications(res.data);
      // Set badge count to the total number of fetched notifications
      setNotificationBadgeCount(res.data.length);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
      setNotifications([]);
      setNotificationBadgeCount(0); // Clear badge on error
    } finally {
      setLoadingNotifications(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchNotificationsCallback(); // This will set the initial badge count
    } else {
      setNotifications([]);
      setNotificationBadgeCount(0);
      setLoadingNotifications(false);
    }
  }, [user?.id, fetchNotificationsCallback]);

  const handleToggleNotifications = async () => {
    const newShowState = !showNotifications;
    setShowNotifications(newShowState);

    if (newShowState && user?.id) {
      // Fetch notifications when opening the panel
      await fetchNotificationsCallback();
      // After fetching and displaying, clear the badge count as the user is now viewing them
      setNotificationBadgeCount(0);
    }
  };

  return (
    <>
      <nav className="bg-blue-700 p-3 h-[3.5rem] flex items-center justify-between relative z-50">
        <div>
          <button
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl md:text-3xl z-50 focus:outline-none"
          >
            {menuOpen ? "←" : "☰"}
          </button>

          <Link to="/panel">
            <h1 className="text-white text-xl md:text-3xl ms-4 font-bold inline">
              MentorHub
            </h1>
          </Link>
        </div>

        <div className="h-full flex focus-within:border-[2px] focus-within:border-[#007AFF] rounded-full ms-[10rem] me-auto">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              onSetFiltros({ search: searchInput, category: "" });
              if (location.pathname !== "/panel") navigate("/panel");
              setSearchInput("");
            }}
          >
            <button
              type="submit"
              className="h-full w-[2rem] bg-white rounded-full rounded-tr-none rounded-br-none"
              aria-label="Buscar clases"
            >
              <img
                src="/search-icon.svg"
                alt="Buscar"
                width={30}
                height={35}
                className="ps-2"
              />
            </button>
            <label htmlFor="searchBar" className="sr-only">
              Buscar clases
            </label>
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

        <div className="relative flex items-center space-x-4">
          <button
            onClick={handleToggleNotifications} // Use the new async handler
            className="text-white relative"
            aria-label="Mostrar notificaciones"
          >
            <IoMdNotificationsOutline className="w-6 h-6" />
            {/* Display notificationBadgeCount on the bell */}
            {notificationBadgeCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {notificationBadgeCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-10 right-12 bg-white shadow-lg rounded-md w-64 max-h-80 overflow-y-auto z-50">
              {loadingNotifications ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Cargando...
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((note, index) => (
                  <div
                    key={note.id || index}
                    className="px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {note.message}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Sin notificaciones
                </div>
              )}
            </div>
          )}

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
              navigate("/login");
            }}
            className="text-white text-sm md:text-base hover:underline"
            aria-label="Cerrar sesión"
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
          {normalizedRole === "teacher" && (
            <Link
              to="/clases/crear"
              onClick={() => setMenuOpen(false)}
              className="hover:text-gray-200"
            >
              Crear una clase
            </Link>
          )}
          {normalizedRole === "student" && (
            <Link
              to="/clases/unirme"
              onClick={() => setMenuOpen(false)}
              className="hover:text-gray-200"
            >
              Unirme a una clase
            </Link>
          )}
          {/* <Link to="/panel" onClick={() => setMenuOpen(false)} className="hover:text-gray-200">
                  Clases
               </Link> */}
          <Link
            to="/suscripcion"
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-200"
          >
            Suscríbete
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
