import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

interface ReviewFormProps {
   rating: number; // Este viene de tu componente de estrellas
   userId: string; // Ya cargado en tu vista
   courseId: string; // Id del curso actual
   userName: string; // Nombre del usuario
}

const NewReviewForm: React.FC<ReviewFormProps> = ({
   rating,
   userId,
   courseId,
   userName,
}) => {
   const initialValues = {
      comment: '',
   };

   const handleSubmit = async (values: typeof initialValues) => {
      try {
         const reviewData = {
            rating, // desde props
            comment: values.comment,
            userId, // dinámico
            courseId, // dinámico
            userName, // dinámico
         };

         await axios.post('/api/reviews', reviewData);
         alert('¡Review enviada!');
      } catch (error) {
         console.error('Error al enviar review', error);
         alert('Ocurrió un error al enviar tu review');
      }
   };

   return (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
         <Form className="flex flex-col gap-4">
            <div>
               <label htmlFor="comment">Tu comentario:</label>
               <br />
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
      </Formik>
   );
};

export default NewReviewForm;
