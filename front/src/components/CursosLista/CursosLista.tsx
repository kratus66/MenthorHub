import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

type CategoriaType = {
   onCategoriaSeleccionada: (categoriaId: string) => void;
   onCategoriaActiva: (categoriaId: string) => void;
   onMateriaSeleccionada: (materiaId: string) => void;
   filtros: { search?: string; category?: string; teacherId?: string };
};

type clasesType = {
   id: string;
   title: string;
   description: string;
   createdAt: string;
   materia: string;
   teacher: {
      id: string;
      name: string;
      email: string;
      password: string;
      role: string;
      phoneNumber: string;
      avatarId: string;
      profileImage: null;
      estudios: string;
      country: string;
      provincia: string;
      localidad: string;
      createdAt: string;
   };
   students: [];
   tasks: [];
   category: {
      id: string;
      name: string;
   };
};

const ITEMS_POR_PAGINA = 10;

const CursosLista = ({
   onCategoriaSeleccionada,
   onCategoriaActiva,
   onMateriaSeleccionada,
   filtros,
}: CategoriaType) => {
   const [paginaActual, setPaginaActual] = useState(1);
   const [clases, setClases] = useState<clasesType[]>([]);

   useEffect(() => {
      axiosInstance
         .get('/classes')
         .then((res) => {
            setClases(res.data);
         })
         .catch((err) => {
            console.error('Error al obtener las clases:', err);
         });
   }, []);

   useEffect(() => {
      axiosInstance
         .post('/filters', filtros)
         .then((res) => {
            setClases(res.data.data);
            setPaginaActual(1);
         })
         .catch((err) => {
            console.log('Error al filtrar!', err);
         });
   }, [filtros]);

   const totalPaginas = Math.ceil(clases.length / ITEMS_POR_PAGINA);

   const cursosPaginados = clases.slice(
      (paginaActual - 1) * ITEMS_POR_PAGINA,
      paginaActual * ITEMS_POR_PAGINA
   );

   const handlePaginaAnterior = () => {
      if (paginaActual > 1) setPaginaActual(paginaActual - 1);
   };

   const handlePaginaSiguiente = () => {
      if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
   };

   const handleLimpiarFiltros = () => {
      setPaginaActual(1);
      onCategoriaSeleccionada('');
      onCategoriaActiva('');
      onMateriaSeleccionada('');
   };

   return (
      <div className="h-auto min-h-[20rem] flex flex-col gap-2">
         <h2 className="text-4xl mb-1">Cursos:</h2>
         <div className="p-3 bg-[#f3f4f6] flex flex-col gap-4">
            <div className="flex justify-center items-center relative">
               <div className="flex gap-2 items-center">
                  <button
                     onClick={handlePaginaAnterior}
                     disabled={paginaActual === 1}
                     className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                     ◀
                  </button>
                  <span>
                     Página {paginaActual} de {totalPaginas}
                  </span>
                  <button
                     onClick={handlePaginaSiguiente}
                     disabled={paginaActual === totalPaginas}
                     className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                     ▶
                  </button>
               </div>
               <button
                  onClick={handleLimpiarFiltros}
                  className="bg-blue-400 text-white px-4 py-2 rounded absolute right-0"
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
                        {/* <h3>Materia: {curso.materia}</h3> */}
                     </div>
                  </div>
               </Link>
            ))}
            <div className="flex justify-center items-center relative">
               <div className="flex gap-2 items-center">
                  <button
                     onClick={handlePaginaAnterior}
                     disabled={paginaActual === 1}
                     className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                     ◀
                  </button>
                  <span>
                     Página {paginaActual} de {totalPaginas}
                  </span>
                  <button
                     onClick={handlePaginaSiguiente}
                     disabled={paginaActual === totalPaginas}
                     className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                     ▶
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CursosLista;
