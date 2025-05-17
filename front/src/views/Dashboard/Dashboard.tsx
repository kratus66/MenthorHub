import { useEffect, useState } from 'react';
import type { Categoria } from '../../types/Categoria';
import categorias_array from '../../helpers/categorias';
import CategoriaCard from '../../components/CategoriaCard/CategoriaCard';
import MateriasScroll from '../../components/MateriasScroll/MateriasScroll';

const Dashboard = () => {
   const [categorias, setCategorias] = useState<Categoria[]>([]);
   const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
      string | null
   >(null);

   const handleCategoriaClick = (nombre: string) => {
      setCategoriaSeleccionada(nombre);
      console.log('Categoría seleccionada:', nombre);
   };

   useEffect(() => {
      setCategorias(categorias_array);
   }, []);

   return (
      <>
         <div className="w-screen h-[calc(100vh-68px)] flex ">
            <div className="h-[calc(100% - 68px)] w-3/4 m-4 flex flex-col gap-6">
               <div className="min-h-[20rem] w-full flex flex-col gap-2">
                  <h2 className="text-4xl">Categorias</h2>
                  <div className="h-[13rem] flex flex-nowrap overflow-x-scroll overflow-y-visible">
                     {categorias.map((categoria, index) => (
                        <button
                           key={index}
                           onClick={() => handleCategoriaClick(categoria.id)}
                        >
                           <CategoriaCard
                              id={categoria.id}
                              nombre={categoria.nombre}
                              imagen={categoria.imagen}
                           />
                        </button>
                     ))}
                  </div>
               </div>
               {categoriaSeleccionada && (
                  <MateriasScroll categoria={categoriaSeleccionada} />
               )}
            </div>
            <div className="h-[calc(100% - 68px)] w-1/4 m-4 bg-blue-500 rounded-xl">
               <h2>usuarios</h2>
            </div>
         </div>
      </>
   );
};

export default Dashboard;
