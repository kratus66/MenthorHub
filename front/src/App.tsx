import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home/home';
import Login from './views/Login/Login';
import Usuario from './views/Usuario/Usuario';
import Clases from './views/Clases/Clases';
import AboutUs from './views/AboutUs/AboutUs';
import NavBar from './components/Navbar/Navbar';
import Landing from './views/Landing/Landing';
import Register from './views/Register/Register';
import Dashboard from './views/Dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      
      {window.location.pathname !== '/login' && window.location.pathname !== '/register' &&  window.location.pathname !== '/' && <NavBar />}
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/panel" element={<Dashboard />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
