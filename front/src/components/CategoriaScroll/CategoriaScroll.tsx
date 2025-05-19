import { useState } from 'react';
import categorias_array from '../../helpers/categorias';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type Props = {
   onCategoriaSeleccionada: (categoriaId: string) => void;
};

const CategoriaScroll = ({ onCategoriaSeleccionada }: Props) => {
   const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

   const handleCategoriaClick = (id: string) => {
      setCategoriaActiva(id);
      onCategoriaSeleccionada(id);
   };

   return (
      <>
         <div className="min-h-[15rem] w-full flex flex-col gap-2">
            <h2 className="text-4xl">Categorias</h2>
            <div className="h-[12rem] flex flex-nowrap overflow-x-scroll overflow-y-visible gap-2">
               {categorias_array.map((categoria, index) => (
                  <button
                     key={index}
                     onClick={() => handleCategoriaClick(categoria.id)}
                  >
                     <CategoriaCard
                        id={categoria.id}
                        nombre={categoria.nombre}
                        imagen={categoria.imagen}
                        seleccionada={categoriaActiva === categoria.id}
                     />
                  </button>
               ))}
            </div>
         </div>
      </>
   );
};

export default CategoriaScroll;
