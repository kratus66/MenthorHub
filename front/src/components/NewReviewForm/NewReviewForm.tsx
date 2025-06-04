import React from 'react';
import { Formik, Form, Field } from 'formik';
import RatingEstrellas from '../RatingEstrellas/RatingEstrellas';
import axiosInstance from '../../services/axiosInstance';

interface ReviewFormProps {
   courseId: string;
   targetStudentId: string;
   setReviewSent: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewReviewForm: React.FC<ReviewFormProps> = ({
   courseId,
   targetStudentId,
   setReviewSent,
}) => {
   const initialValues = {
      rating: 0,
      comment: '',
   };

   const handleSubmit = async (values: typeof initialValues) => {
      try {
         const payload = {
            rating: values.rating,
            comment: values.comment,
            courseId,
            targetStudentId,
            type: 'review',
         };

         await axiosInstance.post('/reviews', payload);
         console.log('Payload enviado:', payload);
         alert('¡Review enviada con éxito!');
         setReviewSent(true);
         setTimeout(() => {
            setReviewSent(false);
         }, 200);
      } catch (error) {
         console.error('Error al enviar la review:', error);
         alert('Hubo un error al enviar tu review.');
      }
   };

   return (
      <div className="w-3/4 mx-auto">
         <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => (
               <Form className="flex flex-col gap-4">
                  <div>
                     <label>Tu puntuación:</label>
                     <RatingEstrellas
                        value={values.rating}
                        onChange={(val) => setFieldValue('rating', val)}
                     />
                  </div>

                  <div>
                     <label htmlFor="comment">Tu comentario:</label>
                     <Field
                        as="textarea"
                        name="comment"
                        rows={4}
                        className="border p-2 w-full"
                     />
                  </div>

                  <button
                     type="submit"
                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                     Enviar review
                  </button>
               </Form>
            )}
         </Formik>
      </div>
   );
};

export default NewReviewForm;
