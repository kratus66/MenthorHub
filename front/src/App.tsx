import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home/Home';
import Login from './components/LoginForm/LoginForm';
import Usuario from './views/Usuario/Usuario';
import Clases from './views/Clases/Clases';
import AboutUs from './views/AboutUs/AboutUs';
import NavBar from './components/Navbar/Navbar';
import Landing from './views/Landing/Landing';
import Register from './views/Register/Register';

const App = () => {
  return (
    <Router>
      {/* Usamos la propiedad pathname del window.location para determinar si mostrar el NavBar */}
      {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <NavBar />}
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
