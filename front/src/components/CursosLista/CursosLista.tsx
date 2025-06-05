import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import type { clasesType } from '../../types/ClassType';

type CategoriaType = {
   onCategoriaSeleccionada: (categoriaId: string) => void;
   onCategoriaActiva: (categoriaId: string) => void;
   onMateriaSeleccionada: (materiaId: string) => void;
   filtros: { search?: string; category?: string; teacherId?: string };
   setFiltros: React.Dispatch<
      React.SetStateAction<{
         search?: string;
         category?: string;
         teacherId?: string;
      }>
   >;
};

const ITEMS_POR_PAGINA = 10;

const CursosLista = ({
   onCategoriaSeleccionada,
   onCategoriaActiva,
   onMateriaSeleccionada,
   filtros,
   setFiltros,
}: CategoriaType) => {
   const [paginaActual, setPaginaActual] = useState(1);
   const [cursosPaginados, setCursosPaginados] = useState<clasesType[]>([]);
   const [ultimaPagina, setUltimaPagina] = useState(1);

   useEffect(() => {
      setPaginaActual(1);
   }, [filtros]);

   useEffect(() => {
      const query = new URLSearchParams({
         page: paginaActual.toString(),
         limit: ITEMS_POR_PAGINA.toString(),
      }).toString();

      axiosInstance
         .post(`/filters?${query}`, { ...filtros })
         .then((res) => {
            setCursosPaginados(res.data.data);
            setUltimaPagina(res.data.lastPage);
         })
         .catch((err) => {
            console.log('Error al filtrar!', err);
         });
   }, [filtros, paginaActual]);

   const handlePaginaAnterior = () => {
      if (paginaActual > 1) {
         setPaginaActual((prev) => prev - 1);
      }
   };

   const handlePaginaSiguiente = () => {
      if (paginaActual < ultimaPagina) {
         setPaginaActual((prev) => prev + 1);
      }
   };

   const handleLimpiarFiltros = () => {
      onCategoriaSeleccionada('');
      onCategoriaActiva('');
      onMateriaSeleccionada('');
      setFiltros({ search: '', category: '', teacherId: '' });
   };

   return (
      <div className="h-auto min-h-[20rem] flex flex-col gap-2">
         <h2 className="text-4xl mb-1">Cursos:</h2>
         <div className="p-3 bg-[#f3f4f6] flex flex-col gap-4">
            <div className="flex justify-center items-center relative">
               {ultimaPagina > 0 ? (
                  <div className="flex gap-2 items-center">
                     <button
                        onClick={handlePaginaAnterior}
                        disabled={paginaActual === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                     >
                        ◀
                     </button>
                     <span>
                        Página {paginaActual} de {ultimaPagina}
                     </span>
                     <button
                        onClick={handlePaginaSiguiente}
                        disabled={paginaActual === ultimaPagina}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                     >
                        ▶
                     </button>
                  </div>
               ) : (
                  ''
               )}
               <button
                  onClick={handleLimpiarFiltros}
                  className="bg-blue-500 text-white px-4 py-2 rounded absolute right-0"
               >
                  Limpiar Filtros
               </button>
            </div>

            {cursosPaginados.length === 0 && (
               <p className="text-center text-gray-500">
                  No hay cursos en esta categoría.
               </p>
            )}

            {cursosPaginados.map((curso) => (
               <Link to={`/cursos/${curso.id}`} key={curso.id}>
                  <div className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 hover:cursor-pointer transition-colors flex justify-between">
                     <div>
                        <h3 className="text-xl font-semibold text-blue-400">
                           {curso.title}
                        </h3>
                        <p className="text-gray-600">
                           Profesor: {curso.teacher.name}
                        </p>
                     </div>
                     <div className="flex flex-col">
                        <h3>Categoría: {curso.category.name}</h3>
                        <h3>Materia: {curso.materia.name}</h3>
                     </div>
                  </div>
               </Link>
            ))}
            <div className="flex justify-center items-center relative">
               {ultimaPagina > 0 ? (
                  <div className="flex gap-2 items-center">
                     <button
                        onClick={handlePaginaAnterior}
                        disabled={paginaActual === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                     >
                        ◀
                     </button>
                     <span>
                        Página {paginaActual} de {ultimaPagina}
                     </span>
                     <button
                        onClick={handlePaginaSiguiente}
                        disabled={paginaActual === ultimaPagina}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                     >
                        ▶
                     </button>
                  </div>
               ) : (
                  ''
               )}
            </div>
         </div>
      </div>
   );
};

export default CursosLista;
