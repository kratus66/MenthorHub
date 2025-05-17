import MateriasScroll from '../../components/MateriasScroll/MateriasScroll';
import CategoriaScroll from '../../components/CategoriaScroll/CategoriaScroll';
import { useState } from 'react';

const Dashboard = () => {
   const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
      string | null
   >(null);

   return (
      <>
         <div className="w-screen h-[calc(100vh-68px)] flex bg-[#f9fafb]">
            <div className="h-[calc(100% - 68px)] w-3/4 m-4 flex flex-col gap-6 overflow-y-scroll">
               <CategoriaScroll
                  onCategoriaSeleccionada={setCategoriaSeleccionada}
               />
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
