import React from 'react'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import imagenRobot from "../../images/imagenRobot.png"

const Register: React.FC = () => {
  const handleSubmit = (formData: { estudios: string; rol: string; localidad: string; provincia: string; pais: string }) => {
   
    console.log('Formulario enviado', formData)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 relative">
      <div className="absolute inset-0 bg-opacity-20" style={{ backgroundImage: `url(${imagenRobot})`, backgroundPosition: 'right center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
      
      <div className="flex-1 p-8 flex items-center justify-center relative z-10">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">MentorHub</h1>
          <h2 className="text-xl font-medium text-center text-gray-700 mb-8">Registro</h2>

          <RegisterForm onSubmit={handleSubmit} /> 
        </div>
      </div>
    </div>
  )
}

export default Register
