import { useState, useEffect } from 'react';
import axios from 'axios';

type StarRatingProps = {
   classId: string;
   initialAverage: number;
};

const RatingEstrellas = ({ classId, initialAverage }: StarRatingProps) => {
   const [hovered, setHovered] = useState<number | null>(null);
   const [selected, setSelected] = useState<number | null>(null);
   const [average, setAverage] = useState<number>(initialAverage);

   const handleClick = async (rating: number) => {
      setSelected(rating);
      try {
         const res = await axios.post(`/api/ratings`, {
            classId,
            rating,
         });
         setAverage(res.data.newAverage);
      } catch (err) {
         console.error('Error al enviar rating', err);
      }
   };

   const displayValue = hovered ?? average;

   return (
      <div className="flex gap-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <button
               key={star}
               onMouseEnter={() => setHovered(star)}
               onMouseLeave={() => setHovered(null)}
               onClick={() => handleClick(star)}
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
