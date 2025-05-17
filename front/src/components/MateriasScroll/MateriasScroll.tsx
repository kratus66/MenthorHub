import { useEffect, useState } from 'react';
import CategoriaCard from '../CategoriaCard/CategoriaCard';

type MateriaScollType = {
   categoria: string;
};

const MateriasScroll = ({ categoria }: MateriaScollType) => {
   const [materias, setMaterias] = useState<string>('');

   useEffect(() => {
      setMaterias(categoria);
   }, []);

   return (
      <>
         <div className="min-h-[20rem] w-full flex flex-col gap-2">
            <h2 className="text-4xl">Materias: {categoria}</h2>
            <div className="h-[13rem] flex flex-nowrap overflow-x-scroll overflow-y-visible">
               {/* {categorias.map((categoria, index) => (
                  <CategoriaCard
                     key={index}
                     nombre={categoria.nombre}
                     imagen={categoria.imagen}
                  />
               ))} */}
            </div>
         </div>
      </>
   );
};

export default MateriasScroll;
