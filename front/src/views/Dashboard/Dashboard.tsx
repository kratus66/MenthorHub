import MateriasScroll from '../../components/MateriasScroll/MateriasScroll';
import CategoriaScroll from '../../components/CategoriaScroll/CategoriaScroll';
import CursosLista from '../../components/CursosLista/CursosLista';
import { useState } from 'react';

const Dashboard = () => {
   const [categoriaSeleccionada, setCategoriaSeleccionada] =
      useState<string>('');
   const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
   const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
   const [materiasVisibles, setMateriasVisibles] = useState<
      { id: string; descripcion: string }[]
   >([]);

   return (
      <>
         <div className="w-screen h-[calc(100vh-68px)] flex bg-[#f9fafb]">
            <div className="h-[calc(100% - 68px)] w-3/4 m-4 flex flex-col gap-6 overflow-y-scroll ps-5">
               <CategoriaScroll
                  onCategoriaSeleccionada={setCategoriaSeleccionada}
                  onMateriaSeleccionada={setMateriaSeleccionada}
                  onCategoriaActiva={setCategoriaActiva}
                  onMateriasDeCategoria={setMateriasVisibles}
                  categoriaActiva={categoriaActiva || undefined}
               />
               <MateriasScroll
                  materias={materiasVisibles}
                  onMateriaSeleccionada={setMateriaSeleccionada}
                  materiaSeleccionada={materiaSeleccionada}
               />
               <CursosLista
                  categoria={categoriaSeleccionada}
                  materiaSeleccionada={materiaSeleccionada}
                  onCategoriaSeleccionada={setCategoriaSeleccionada}
                  onMateriaSeleccionada={setMateriaSeleccionada}
                  onCategoriaActiva={setCategoriaActiva}
               />
            </div>
            <div className="h-[calc(100% - 68px)] w-1/4 m-4 bg-[#f3f4f6] rounded-xl">
               <h2></h2>
            </div>
         </div>
      </>
   );
};

export default Dashboard;
