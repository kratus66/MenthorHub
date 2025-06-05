import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; // Assuming axiosInstance is correctly set up

const EmailValidationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Mensaje inicial en español
  const [message, setMessage] = useState<string>('Validando tu correo electrónico, por favor espera...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      // Mensaje de error si no se encuentra el token
      setMessage('Token de validación no encontrado en la URL. Por favor, verifica el enlace o contacta a soporte.');
      setIsLoading(false);
      setIsError(true);
      return;
    }

    const validateEmail = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        // The endpoint is /api/auth/confirm-email and it expects the token as a query parameter
        // The full URL for the API call will be constructed by axiosInstance based on its baseURL
        // and the provided path: `/api/auth/confirm-email?token=${token}`
        await axiosInstance.get(`auth/confirm-email?token=${token}`);

        // Mensaje de éxito en español
        setMessage('¡Correo electrónico validado correctamente! Redirigiendo a inicio de sesión...');
        setIsLoading(false);

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000); // 3 seconds delay

      } catch (error: any) {
        setIsLoading(false);
        setIsError(true);
        // Mensajes de error en español
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(`Validación fallida: ${error.response.data.message}`);
        } else if (error.request) {
          setMessage('La solicitud de validación falló. El servidor podría no estar disponible. Por favor, inténtalo de nuevo más tarde.');
        } else {
          setMessage('Ocurrió un error inesperado durante la validación del correo electrónico. Por favor, contacta a soporte.');
        }
        console.error('Email validation error:', error);
      }
    };

    validateEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
      <h1>Validación de Correo Electrónico</h1> {/* Título en español */}
      {isLoading && <p>Cargando...</p>} {/* Mensaje de carga en español */}
      <p style={{ color: isError ? 'red' : 'green', fontSize: '1.2em' }}>
        {message}
      </p>
      {!isLoading && isError && (
        // Botón en español
        <button onClick={() => navigate('/auth/login')} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Ir a Inicio de Sesión
        </button>
      )}
    </div>
  );
};

export default EmailValidationPage;
