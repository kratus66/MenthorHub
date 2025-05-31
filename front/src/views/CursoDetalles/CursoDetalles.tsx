import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import type { clasesType } from '../../types/ClassType';

const CursoDetalle = () => {
   const { id } = useParams<{ id: string }>();
   const [curso, setCurso] = useState<clasesType>();

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
         <div className="max-w-6xl w-full h-screen bg-gray-100 shadow-lg rounded-lg p-8 m-4 lg:m-0 flex flex-col gap-6">
            <div className="w-full flex flex-col items-center">
               <h2 className="text-4xl font-bold text-gray-900 underline">
                  {curso.title}
               </h2>
               <div className="flex mt-2 ">
                  <p className="text-gray-600 text-2xl">
                     <strong>Categoría:</strong> {curso.category.name}
                  </p>
                  <span className="mx-4 text-2xl">|</span>
                  <p className="text-gray-600 text-2xl">
                     <strong>Materia:</strong> {curso.materia.descripcion}
                  </p>
               </div>
               <p className="text-gray-600 mt-4 text-2xl">
                  <strong>Profesor:</strong> {curso.teacher.name}
               </p>

               <button
                  className="mt-6 w-1/3 bg-turquoise text-black bg-blue-400 py-3 rounded-lg font-semibold text-lg"
                  onClick={() => alert('Inscripción simulada')}
               >
                  Inscribirme
               </button>
            </div>
            <hr className="border-2 border-blue-500" />
            <div className="w-full">
               <img
                  src={
                     curso.category.imageUrl
                        ? curso.category.imageUrl
                        : '/image-placeholder.jpg'
                  }
                  //   src={curso.category.imagen || '/placeholder.jpg'}
                  alt={curso.title}
                  className="w-1/2 h-auto rounded-lg object-contain float-left m-4"
               />
               <p className="text-gray-700 mt-4 text-2xl">
                  {curso.description ||
                     'Este curso aún no tiene una descripción detallada.'}
               </p>
            </div>
         </div>
      </div>
   );
};

export default CursoDetalle;
