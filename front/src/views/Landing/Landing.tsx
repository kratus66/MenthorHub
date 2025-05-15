import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-400 to-slate-300 text-white px-4">
         <h1 className="text-6xl font-bold mb-8 drop-shadow-lg">MentorHub</h1>
         <div className="flex justify-between">
            <div className="max-w-[40rem] flex flex-col justify-between content-center gap-4 bg-[#ffffff44] rounded-xl p-6">
               <h2 className="text-3xl text-black">
                  Conectamos Mentores con Mentes Curiosas
               </h2>
               <p className="text-black">
                  MentorHub es una plataforma pensada para facilitar la conexión
                  entre personas que quieren aprender y expertos dispuestos a
                  enseñar.
               </p>
               <div className="flex justify-evenly gap-12">
                  <div className="flex flex-col justify-between content-center gap-1">
                     <h2 className="text-black m-1">
                        ¿Ya tenés cuenta? Iniciá sesión
                     </h2>
                     <Link
                        to="/login"
                        className="bg-blue-700 w-max rounded-full p-3 px-5 self-center hover:brightness-125"
                     >
                        Iniciar Sesión
                     </Link>
                  </div>
                  <div className="flex flex-col justify-between gap-1">
                     <h2 className="text-black m-1">...o crea tu cuenta.</h2>
                     <ul className="text-blue-500">
                        <li className="hover:underline">
                           <Link to="">👉 Soy Mentor</Link>
                        </li>
                        <li className="hover:underline">
                           <Link to="">🙋‍♂️ Quiero Aprender</Link>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
            <div>
               <video autoPlay loop muted playsInline className="menvirLanding">
                  <source src="/MenVir_Alegria.webm" type="video/webm" />
               </video>
            </div>
         </div>
      </div>
   );
};

export default Landing;
