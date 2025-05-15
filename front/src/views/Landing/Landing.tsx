import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-400 to-slate-300 text-white px-4">
         <h1 className="text-6xl font-bold mb-8 drop-shadow-lg">MentorHub</h1>

         <p className="mt-6 text-white text-sm">
            ¿Aún no tienes cuenta?{' '}
            <Link
               to="/register"
               className="text-white font-semibold underline hover:text-blue-100 transition"
            >
               Regístrate aquí
            </Link>
         </p>
      </div>
   );
};

export default Landing;
