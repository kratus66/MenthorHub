import materiasPorCategoria from '../../helpers/materias';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type SelectedCategoryType = {
   categoria: string;
   materiaSeleccionada: string;
   onMateriaSeleccionada: (MateriaId: string) => void;
};

const MateriasScroll = ({
   categoria = 'Música',
   materiaSeleccionada = '',
   onMateriaSeleccionada,
}: SelectedCategoryType) => {
   const categoriaReal =
      categoria && categoria.trim() !== '' ? categoria : 'Música';
   const materias = materiasPorCategoria[categoriaReal] || [];

   const handleMateriaClick = (nombre: string) => {
      onMateriaSeleccionada(nombre);
   };

   return (
      <>
         <div className="min-h-[13rem] w-full flex flex-col gap-2">
            <h2 className="text-4xl">Materias:</h2>
            <div className="h-[10rem] flex flex-nowrap overflow-x-scroll overflow-y-visible gap-2">
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
