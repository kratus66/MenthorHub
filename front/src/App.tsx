import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

import Home from "./views/Home/home";
import Login from "./views/Login/Login";
import Usuario from "./views/Usuario/Usuario";
import CrearClase from "./views/Clases/CrearClase";
import UnirmeClase from "./views/Clases/UnirmeClase";
import AboutUs from "./views/AboutUs/AboutUs";
import NavBar from "./components/Navbar/Navbar";
import Landing from "./views/Landing/Landing";
import Register from "./views/Register/Register";
import Dashboard from "./views/Dashboard/Dashboard";
import Terminos from "./views/terminos-condiciones/Terminos";
import Layout from "./components/layout/Layout";
import ConoceMas from "./views/ConoceMas.tsx/ConoceMas";
import CursoDetalle from "./views/CursoDetalles/CursoDetalles";
import AdminPanel from "./admin/AdminPanel";
import { useUser } from "./context/UserContext";
import Oauthlogin from "./views/oauthlogin/oauthlogin";
// import CursoDetalle from './views/CursoDetalles/CursoDetalles';

const AppWrapper = () => {
  //esto es de prueba , cambia role a 'profesor' o 'alumno'
  // const [user, setUser] = useState<{
  // Solo para evitar "'setUser' is declared but its value is never read." en el deploy

  const location = useLocation();
  const noNavFooter = [
    "/login",
    "/register",
    "/",
    "/admin",
    "/oauthlogin",
  ].includes(location.pathname);
  const { user } = useUser(); //

  const [filtros, setFiltros] = useState<{
    search?: string;
    category?: string;
    teacherId?: string;
  }>({});

  return (
    <>
      {/* {!noNavFooter && <NavBar user={user} />} // para evitar "Property 'user' does not exist on type 'IntrinsicAttributes'." */}
      {!noNavFooter && <NavBar onSetFiltros={setFiltros} />}

      {noNavFooter ? (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauthlogin" element={<Oauthlogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/usuario" element={<Usuario />} />

            {user?.role === "profesor" && (
              <Route path="/clases/crear" element={<CrearClase />} />
            )}
            {user?.role === "alumno" && (
              <Route path="/clases/unirme" element={<UnirmeClase />} />
            )}

            <Route
              path="/panel"
              element={<Dashboard filtros={filtros} setFiltros={setFiltros} />}
            />
            <Route path="/cursos/:id" element={<CursoDetalle />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/conoce-mas" element={<ConoceMas />} />
            <Route path="/terminos" element={<Terminos />} />
          </Routes>
        </Layout>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
