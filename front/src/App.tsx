import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

// Componentes de página
import Home from './Home'  
import Login from './Login'  

const App = () => {
  const navigate = useNavigate()

  return (
    <Router> 
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-400 to-slate-300 text-white">
            <h1 className="text-6xl font-bold mb-8 drop-shadow-lg">MentorHub</h1>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-md hover:bg-blue-100 transition"
            >
              Ingresar
            </button>
          </div>
        } />

        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
