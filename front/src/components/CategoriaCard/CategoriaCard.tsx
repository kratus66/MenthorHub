import type { Categoria } from '../../types/Categoria';

const CategoriaCard: React.FC<Categoria> = ({ nombre, imagen }) => {
   return (
      <div className="h-[12rem] aspect-square border-2 m-2 rounded-3xl relative">
         <img src={imagen} alt={nombre} className="h-full object-cover" />
         <h3 className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl bg-[#00000077] rounded-lg p-1">
            {nombre}
         </h3>
      </div>
   );
};

export default CategoriaCard;
