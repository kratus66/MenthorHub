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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
         <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8 m-4 lg:m-0 flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2">
               <img
                  src={
                     curso.category.imageUrl
                        ? curso.category.imageUrl
                        : '/image-placeholder.jpg'
                  }
                  //   src={curso.category.imagen || '/placeholder.jpg'}
                  alt={curso.title}
                  className="w-full h-auto rounded-lg object-contain"
               />
            </div>

            <div className="w-full md:w-1/2">
               <h2 className="text-3xl font-bold text-gray-900">
                  {curso.title}
               </h2>
               <p className="text-gray-600 mt-2">
                  <strong>Profesor:</strong> {curso.teacher.name}
               </p>
               <p className="text-gray-600 mt-2">
                  <strong>Categoría:</strong> {curso.category.name}
               </p>
               <p className="text-gray-600 mt-2">
                  <strong>Materia:</strong> {curso.materia.descripcion}
               </p>
               <p className="text-gray-700 mt-4">
                  {curso.description ||
                     'Este curso aún no tiene una descripción detallada.'}
               </p>

               <button
                  className="mt-6 w-full bg-turquoise text-black bg-blue-400 py-3 rounded-lg font-semibold text-lg"
                  onClick={() => alert('Inscripción simulada')}
               >
                  Inscribirme
               </button>
            </div>
         </div>
      </div>
   );
};

export default CursoDetalle;
