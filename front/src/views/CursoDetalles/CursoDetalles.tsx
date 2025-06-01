import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import type { clasesType } from '../../types/ClassType';
import Chatbot from '../../components/Chatbot/Chatbot';

const CursoDetalle = () => {
   const { id } = useParams<{ id: string }>();
   const [curso, setCurso] = useState<clasesType>();
   const [activeTab, setActiveTab] = useState('general');

   const tabs = [
      { id: 'general', label: 'General' },
      { id: 'tareas', label: 'Tareas' },
      { id: 'profesor', label: 'Profesor' },
   ];

   useEffect(() => {
      axiosInstance.get(`classes/${id}`).then((res) => {
         console.log(res.data);
         setCurso(res.data);
      });
   }, [id]);

   if (!curso) {
      return <div className="p-4">Curso no encontrado</div>;
   }

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
         <div className="max-w-6xl w-full h-screen bg-gray-100 shadow-lg rounded-lg p-8 px-0 m-4 lg:m-0 flex flex-col gap-6">
            <div className="w-full flex flex-col items-center">
               <h2 className="text-4xl font-bold text-gray-900 underline">
                  {curso.title}
               </h2>
               <div className="flex mt-2 ">
                  <p className="text-gray-600 text-lg">
                     <strong>Categoría:</strong> {curso.category.name}
                  </p>
                  <span className="mx-4 text-2xl">|</span>
                  <p className="text-gray-600 text-lg">
                     <strong>Materia:</strong> {curso.materia.name}
                  </p>
               </div>
               <p className="text-gray-600 text-lg">
                  <strong>Profesor:</strong> {curso.teacher.name}
               </p>

               <button
                  className="mt-2 w-1/6 bg-turquoise text-white bg-blue-400 py-2 rounded-lg font-semibold text-md"
                  onClick={() => alert('Inscripción simulada')}
               >
                  Inscribirme
               </button>
            </div>
            {/* <hr className="border-2" /> */}
            <div className="w-full bg-gray-200 h-full rounded-md flex">
               <div className="flex h-full w-full bg-gray-100 rounded shadow overflow-hidden">
                  <div className="w-48 bg-white border-r border-gray-300 flex flex-col">
                     {tabs.map((tab) => {
                        return (
                           <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`py-3 px-4 text-left hover:bg-gray-200 transition ${
                                 activeTab === tab.id
                                    ? 'bg-blue-400 hover:bg-blue-400 font-semibold text-white'
                                    : 'text-gray-700'
                              }`}
                           >
                              {tab.label}
                           </button>
                        );
                     })}
                  </div>
                  <div className="flex-1 rounded-tr-md bg-gray-200 p-4">
                     {activeTab === 'general' && (
                        <>
                           <img
                              src={
                                 curso.category.imageUrl
                                    ? curso.category.imageUrl
                                    : '/image-placeholder.jpg'
                              }
                              alt={curso.title}
                              className="w-1/3 h-auto me-4 mb-4 rounded-lg object-contain float-left"
                           />
                           <p className="text-gray-700 text-lg">
                              {curso.description ||
                                 'Este curso aún no tiene una descripción detallada.'}
                           </p>
                        </>
                     )}
                     {activeTab === 'tareas' && (
                        <p>ACÁ VAN LAS TAREASSSSSSS!!!</p>
                     )}
                     {activeTab === 'profesor' && (
                        <>
                           <img
                              src={
                                 curso.teacher.profileImage
                                    ? curso.teacher.profileImage
                                    : '/images/imagenUsuario.png'
                              }
                              alt="Foto de Perfil"
                              className="w-1/6 h-auto object-contain float-left rounded-full me-4"
                           />
                           <h2 className="font-bold inline">Nombre:</h2>
                           <p className="inline ps-1">{curso.teacher.name}</p>
                           <br />
                           <h2 className="font-bold inline">Localidad:</h2>
                           <p className="inline ps-1">{`${
                              curso.teacher.localidad ?? ''
                           }, ${curso.teacher.country}`}</p>{' '}
                           <br />
                           <h2 className="font-bold inline">Estudios:</h2>
                           <p className="inline ps-1">
                              {curso.teacher.estudios}
                           </p>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>
         <Chatbot />
      </div>
   );
};

export default CursoDetalle;
