import React from 'react';
import { Link } from 'react-router-dom';
import Chatbot from '../../components/Chatbot/Chatbot';
const AboutUs: React.FC = () => {
   return (
      <div className="p-8 max-w-5xl mx-auto">
         <h1 className="text-4xl font-extrabold text-[#007AFF] mb-8 text-center">
            Sobre Nosotros
         </h1>

         <section className="mb-10">
            <p className="text-lg text-gray-800 leading-relaxed">
               Bienvenido a{' '}
               <span className="font-semibold text-[#007AFF]">MentorHub</span>,
               tu plataforma educativa virtual diseñada para unir mentores
               apasionados con estudiantes motivados. Nuestra visión es
               construir una comunidad donde el conocimiento fluya libremente y
               el aprendizaje se convierta en una experiencia compartida.
            </p>
         </section>

         <section className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-100">
               <h2 className="text-xl font-semibold text-[#007AFF] mb-2">
                  🎯 Misión
               </h2>
               <p className="text-gray-700 text-sm">
                  Democratizar el acceso a la educación de calidad, creando
                  vínculos auténticos entre mentores y estudiantes para fomentar
                  el crecimiento profesional y personal.
               </p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-100">
               <h2 className="text-xl font-semibold text-[#007AFF] mb-2">
                  🔭 Visión
               </h2>
               <p className="text-gray-700 text-sm">
                  Ser la comunidad líder en mentorías educativas online,
                  empoderando a cada persona a alcanzar su máximo potencial a
                  través del aprendizaje colaborativo.
               </p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-100">
               <h2 className="text-xl font-semibold text-[#007AFF] mb-2">
                  💡 Valores
               </h2>
               <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Colaboración</li>
                  <li>Empatía</li>
                  <li>Compromiso</li>
                  <li>Accesibilidad</li>
                  <li>Innovación</li>
               </ul>
            </div>
         </section>

         <section className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
               ¿Querés ser parte?
            </h3>
            <p className="text-gray-700 mb-6">
               Unite a MentorHub y comenzá a aprender, enseñar y transformar tu
               camino educativo hoy mismo.
            </p>
            <Link to="/conoce-mas">
               <button className="bg-[#007AFF] hover:bg-[#007AFF] text-white font-semibold py-2 px-6 rounded-full shadow transition duration-300">
                  Conocé más
               </button>
            </Link>
         </section>
         <Chatbot />
      </div>
   );
};

export default AboutUs;
