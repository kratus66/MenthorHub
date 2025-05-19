import { useState } from 'react';
import sampleClasses from '../../helpers/fakeClasses';

type CategoriaType = {
   categoria: string;
   onCategoriaSeleccionada: (categoriaId: string) => void;
   onCategoriaActiva: (categoriaId: string) => void;
};

const ITEMS_POR_PAGINA = 10;

const CursosLista = ({
   categoria,
   onCategoriaSeleccionada,
   onCategoriaActiva,
}: CategoriaType) => {
   const [paginaActual, setPaginaActual] = useState(1);

   const cursosFiltrados = categoria
      ? sampleClasses.filter((curso) => curso.category.nombre === categoria)
      : sampleClasses;

   const totalPaginas = Math.ceil(cursosFiltrados.length / ITEMS_POR_PAGINA);

   const cursosPaginados = cursosFiltrados.slice(
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

            {cursosPaginados.map((curso, index) => (
               <a href="#" key={index}>
                  <div className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 hover:cursor-pointer transition-colors flex justify-between">
                     <div>
                        <h3 className="text-xl font-semibold text-blue-400">
                           {curso.title}
                        </h3>
                        <p className="text-gray-600">
                           Profesor: {curso.teacher.name}
                        </p>
                     </div>
                     <div>
                        <h3>Categoría: {curso.category.nombre}</h3>
                     </div>
                  </div>
               </a>
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
