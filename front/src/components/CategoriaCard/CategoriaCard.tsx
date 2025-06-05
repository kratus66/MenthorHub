type Props = {
  id: string;
  nombre?: string;
  imagen?: string;
  seleccionada?: boolean;
};

const CategoriaCard: React.FC<Props> = ({
  // id, // para evitar 'id' is declared but its value is never read. en deploy
  nombre,
  // imagen,
  seleccionada,
}) => {
  return (
    <div
      className={`h-[8rem] aspect-square border-2 m-1 rounded-3xl bg-blue-200 relative overflow-clip hover:border-blue-700 ${
        seleccionada ? "border-4 border-blue-700 font-bold" : "border-transparent"
      }`}
    >
      {/* <img src={imagen} alt={nombre} className="h-full object-cover" /> */}
      <h3 className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-blue-700 text-[1.2rem] rounded-lg p-1 text-center hover:font-black">
        {nombre}
      </h3>
    </div>
  );
};

export default CategoriaCard;
