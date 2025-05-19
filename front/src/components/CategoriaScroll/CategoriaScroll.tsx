import categorias_array from '../../helpers/categorias';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type Props = {
   onCategoriaSeleccionada: (categoriaId: string) => void;
   onCategoriaActiva: (categoriaId: string) => void;
   categoriaActiva?: string;
};

const CategoriaScroll = ({
   onCategoriaSeleccionada,
   onCategoriaActiva,
   categoriaActiva,
}: Props) => {
   const handleCategoriaClick = (id: string) => {
      onCategoriaActiva(id);
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
                     onClick={() => handleCategoriaClick(categoria.nombre)}
                  >
                     <CategoriaCard
                        id={categoria.id}
                        nombre={categoria.nombre}
                        imagen={categoria.imagen}
                        seleccionada={categoriaActiva === categoria.nombre}
                     />
                  </button>
               ))}
            </div>
         </div>
      </>
   );
};

export default CategoriaScroll;
