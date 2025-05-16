import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './views/Home/home';
import Login from './views/Login/Login';
import Usuario from './views/Usuario/Usuario';
import Clases from './views/Clases/Clases';
import AboutUs from './views/AboutUs/AboutUs';
import NavBar from './components/Navbar/Navbar';
import Landing from './views/Landing/Landing';
import Register from './views/Register/Register';
import Dashboard from './views/Dashboard/Dashboard';

import Terminos from './views/terminos-condiciones/Terminos';
import Layout from './components/layout/Layout';

const AppWrapper = () => {
  
  const location = useLocation();
  const noNavFooter = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      {!noNavFooter && <NavBar />}

      {noNavFooter ? (
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        // Para las demás rutas envuelves en Layout (footer incluido ahí)
        <Layout>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/clases" element={<Clases />} />
            <Route path="/panel" element={<Dashboard />} />
            <Route path="/about-us" element={<AboutUs />} />
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
