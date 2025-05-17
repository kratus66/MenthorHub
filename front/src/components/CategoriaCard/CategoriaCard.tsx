type Props = {
   id: string;
   nombre: string;
   imagen: string;
   seleccionada?: boolean;
};

const CategoriaCard: React.FC<Props> = ({
   id,
   nombre,
   imagen,
   seleccionada,
}) => {
   return (
      <div
         className={`h-[12rem] aspect-square border-2 m-1 rounded-3xl relative overflow-clip ${
            seleccionada
               ? 'border-4 border-blue-700'
               : 'border-4 border-transparent'
         }`}
      >
         <img src={imagen} alt={nombre} className="h-full object-cover" />
         <h3 className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl bg-[#00000055] rounded-lg p-1 text-[1.5rem] text-center">
            {nombre}
         </h3>
      </div>
   );
};

export default CategoriaCard;
