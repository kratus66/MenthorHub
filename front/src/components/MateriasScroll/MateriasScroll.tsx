import materiasPorCategoria from '../../helpers/materias';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type SelectedCategoryType = {
   categoria: string;
};

const MateriasScroll = ({ categoria }: SelectedCategoryType) => {
   const materias = materiasPorCategoria[categoria] || [];

   return (
      <>
         <div className="min-h-[16rem] w-full flex flex-col gap-2">
            <h2 className="text-4xl">Materias: {categoria}</h2>
            <div className="h-[13rem] flex flex-nowrap overflow-x-scroll overflow-y-visible">
               {materias.length > 0 ? (
                  materias.map((materia, index) => (
                     <CategoriaCard
                        key={index}
                        id=""
                        nombre={materia.nombre}
                        imagen={materia.imagen}
                     />
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
