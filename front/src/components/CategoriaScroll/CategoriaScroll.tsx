import { useEffect, useState } from 'react';
import CategoriaCard from '../CategoriaCard/CategoriaCard';
import axiosInstance from '../../services/axiosInstance';

type Props = {
   onCategoriaSeleccionada: (categoriaId: string) => void;
   onCategoriaActiva: (categoriaId: string) => void;
   onMateriaSeleccionada: (materiaId: string) => void;
   onMateriasDeCategoria: (
      materias: { id: string; descripcion: string }[]
   ) => void;
   categoriaActiva?: string;
};

type CategoryType = {
   id: string;
   name: string;
   imageUrl: string;
   materias: { id: string; descripcion: string }[];
};

const CategoriaScroll = ({
   onCategoriaSeleccionada,
   onMateriaSeleccionada,
   onCategoriaActiva,
   onMateriasDeCategoria,
   categoriaActiva,
}: Props) => {
   const [categorias, setCategorias] = useState<CategoryType[]>([]);

   useEffect(() => {
      axiosInstance
         .get('/categories')
         .then((res) => {
            setCategorias(res.data);
         })
         .catch((err) => {
            console.error('Error al obtener las clases:', err);
         });
   }, []);

   const handleCategoriaClick = (categoria: CategoryType) => {
      onCategoriaActiva(categoria.id);
      onCategoriaSeleccionada(categoria.id);
      onMateriaSeleccionada('');
      onMateriasDeCategoria(categoria.materias);
   };

   return (
      <>
         <div className="min-h-[13rem] w-full flex flex-col gap-2">
            <h2 className="text-4xl">Sector:</h2>
            <div className="h-[10rem] flex flex-nowrap overflow-x-scroll overflow-y-visible gap-2">
               {categorias.map((categoria, index) => (
                  <button
                     key={index}
                     onClick={() => handleCategoriaClick(categoria)}
                  >
                     <CategoriaCard
                        id={categoria.id}
                        nombre={categoria.name}
                        imagen={categoria.imageUrl}
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
