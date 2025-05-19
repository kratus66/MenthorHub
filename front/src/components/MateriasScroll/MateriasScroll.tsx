import { useState } from 'react';
import materiasPorCategoria from '../../helpers/materias';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type SelectedCategoryType = {
   categoria: string;
};

const MateriasScroll = ({ categoria = 'Música' }: SelectedCategoryType) => {
   const categoriaReal =
      categoria && categoria.trim() !== '' ? categoria : 'Música';
   const materias = materiasPorCategoria[categoriaReal] || [];
   const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

   const handleMateriaClick = (nombre: string) => {
      setMateriaSeleccionada(nombre);
   };

   console.log('Categoria que recibe MateriasScroll:' + categoria);

   return (
      <>
         <div className="min-h-[15rem] w-full flex flex-col gap-2">
            <h2 className="text-4xl">Materias:</h2>
            <div className="h-[12rem] flex flex-nowrap overflow-x-scroll overflow-y-visible gap-2">
               {materias.map((materia, index) => (
                  <button
                     key={index}
                     onClick={() => handleMateriaClick(materia.nombre)}
                  >
                     <CategoriaCard
                        id={materia.id}
                        nombre={materia.nombre}
                        imagen={materia.imagen}
                        seleccionada={materiaSeleccionada === materia.nombre}
                     />
                  </button>
               ))}
            </div>
         </div>
      </>
   );
};

export default MateriasScroll;
