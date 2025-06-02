import type { MateriaType } from '../../types/MateriaType';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type Props = {
   materias: MateriaType[]; // Recibo el array de materias filtradas desde afuera
   materiaSeleccionada: string; // Materia seleccionada para marcarla
   onMateriaSeleccionada: (materiaId: string) => void; // Callback para seleccionar materia
};

const MateriasScroll = ({
   materias,
   materiaSeleccionada,
   onMateriaSeleccionada,
}: Props) => {
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
                     onClick={() => handleMateriaClick(materia.name)}
                  >
                     <CategoriaCard
                        id={materia.id}
                        nombre={materia.name}
                        imagen={materia.imagenUrl || '/image-placeholder.jpg'}
                        seleccionada={
                           materiaSeleccionada === materia.name
                        }
                     />
                  </button>
               ))}
            </div>
         </div>
      </>
   );
};

export default MateriasScroll;
