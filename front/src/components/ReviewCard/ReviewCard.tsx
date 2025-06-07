import type { Review } from '../../interfaces/Review';
import RatingPromedio from '../RatingPromedio/RatingPromedio';

const ReviewCard = ({ review }: { review: Review }) => {
   const { rating, comment, author, targetStudent, createdAt } = review;

   return (
      <div className="w-[25rem] p-5 border bg-white rounded-md mx-auto shadow-lg">
         <div className="flex">
            <img
               src={targetStudent?.profileImage}
               alt="Foto de perfil"
               className="w-[3rem] h-[3rem] me-6 rounded-full"
            />
            <div className="flex flex-col">
               <h2>{author.name}</h2>
               <RatingPromedio promedio={rating} />
               <p>
                  {new Date(createdAt).toLocaleDateString('es-ES', {
                     day: 'numeric',
                     month: 'long',
                     year: 'numeric',
                  })}
               </p>
            </div>
         </div>
         <div className="text-black text-md mt-4">{comment}</div>
      </div>
   );
};

export default ReviewCard;
