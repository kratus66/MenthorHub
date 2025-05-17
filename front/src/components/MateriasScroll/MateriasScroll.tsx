import { useState } from 'react';
import materiasPorCategoria from '../../helpers/materias';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type SelectedCategoryType = {
   categoria: string;
};

const MateriasScroll = ({ categoria }: SelectedCategoryType) => {
   const materias = materiasPorCategoria[categoria] || [];
   const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

   const handleMateriaClick = (id: string) => {
      setMateriaSeleccionada(id);
      console.log('Materia seleccionada:', id);
   };

   return (
      <>
         <div className="min-h-[17rem] w-full flex flex-col gap-2">
            <h2 className="text-4xl">Materias:</h2>
            <div className="h-[13rem] flex flex-nowrap overflow-x-scroll overflow-y-visible">
               {materias.length > 0 ? (
                  materias.map((materia, index) => (
                     <button
                        key={index}
                        onClick={() => handleMateriaClick(materia.id)}
                     >
                        <CategoriaCard
                           id={materia.id}
                           nombre={materia.nombre}
                           imagen={materia.imagen}
                           seleccionada={materiaSeleccionada === materia.id}
                        />
                     </button>
                  ))
               ) : (
                  <p className="text-lg text-gray-600">
                     No hay materias para esta categoría.
                  </p>
               )}
            </div>
         </div>
      </>
   );
};

export default MateriasScroll;
