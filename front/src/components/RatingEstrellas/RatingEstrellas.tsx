import { useState } from 'react';

type StarRatingProps = {
   value: number;
   onChange: (rating: number) => void;
};

const RatingEstrellas = ({ value, onChange }: StarRatingProps) => {
   const [hovered, setHovered] = useState<number | null>(null);
   const displayValue = hovered ?? value;

   return (
      <div className="flex gap-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <button
               key={star}
               type="button"
               onMouseEnter={() => setHovered(star)}
               onMouseLeave={() => setHovered(null)}
               onClick={() => onChange(star)}
               className={`text-2xl transition-colors ${
                  star <= displayValue ? 'text-yellow-400' : 'text-gray-300'
               }`}
            >
               ★
            </button>
         ))}
      </div>
   );
};

export default RatingEstrellas;
