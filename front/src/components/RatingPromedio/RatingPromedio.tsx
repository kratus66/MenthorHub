type RatingPromedioProps = {
   promedio: number;
};

const RatingPromedio = ({ promedio }: RatingPromedioProps) => {
   return (
      <div className="flex gap-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <span
               key={star}
               className={`text-2xl ${
                  star <= Math.round(promedio)
                     ? 'text-yellow-400'
                     : 'text-gray-300'
               }`}
            >
               ★
            </span>
         ))}
      </div>
   );
};

export default RatingPromedio;
