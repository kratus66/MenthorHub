import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import imagenRobot from "../../images/imagenRobot.png";
import axiosInstance from '../../services/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await axiosInstance.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Respuesta del servidor:', response.data);
      toast.success(response.data.message || 'Registro exitoso');
      setTimeout(() => navigate('/login'), 2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
  console.error('Error al registrar:', error);
  const errorMessage = error.response?.data?.message;

  if (errorMessage) {
    toast.error(errorMessage);

    // Redirigir al login si ya hay una cuenta registrada
    if (
      errorMessage.toLowerCase().includes('ya existe una cuenta registrada') ||
      errorMessage.toLowerCase().includes('correo ya registrado') ||
      errorMessage.toLowerCase().includes('ya está registrado')
    ) {
      setTimeout(() => navigate('/login'), 3000); // da tiempo a leer el toast
    }
  } else {
    toast.error('Error inesperado al registrar. Por favor intenta nuevamente.');
  }
}
  };

  return (
    <div className="flex h-screen w-full relative">
      <div className="w-1/2 relative bg-white bg-opacity-70 backdrop-blur-lg overflow-hidden">
        <img
          src={imagenRobot}
          alt="Robot Fondo"
          className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none select-none transform scale-[1.8] translate-x-[20%]"
          style={{ userSelect: 'none', objectPosition: 'center right' }}
        />
      </div>

      <div className="w-1/2 bg-[#007AFF] relative bg-opacity-75 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-full"
        >
          <path d="M100,0 Q90,90 0,100 L0,0 Z" fill="#007AFF" />
        </svg>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl p-12 w-11/12 max-w-4xl shadow-lg z-20">
                  <button
  onClick={() => navigate('/login')}
  className="absolute top-4 left-4 text-gray-700 hover:text-black transition duration-300 flex items-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 mr-1"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  <span className="text-sm">Volver al login</span>
</button>
        <h1 className="text-4xl font-bold text-black mb-3">MentorHub</h1>
        <h2 className="text-xl font-medium text-gray-700 mb-8">Registro</h2>
        <RegisterForm onSubmit={handleSubmit} />
      </div>

   
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Register;
