// components/UserModal.tsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from '../../services/axiosInstance';
import type { CategoryType } from '../../types/CategoryType';
import type { MateriaType } from '../../types/MateriaType';
import type { Class } from '../../interfaces/Class';
import type { Teacher } from '../../types/entities';

type NewUserModalProps = {
   categorias: CategoryType[];
   materias: MateriaType[];
   teachers: Teacher[];
   setNewClassConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
   setShowNewClassModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewClassModal = ({
   categorias,
   materias,
   teachers,
   setNewClassConfirmed,
   setShowNewClassModal,
}: NewUserModalProps) => {
   const initialValues = {
      title: '',
      description: '',
      teacherId: '',
      categoryId: '',
      materiaId: '',
   };

   const validate = (values: typeof initialValues) => {
      const errors: Partial<typeof initialValues> = {};

      if (!values.title) {
         errors.title = 'El título es requerido';
      }

      if (!values.description) {
         errors.description = 'La descripción es requerida';
      }

      if (!values.teacherId) {
         errors.teacherId = 'El profesor es requerido';
      }

      if (!values.categoryId) {
         errors.categoryId = 'La categoría es requerida';
      }

      if (!values.materiaId) {
         errors.materiaId = 'La materia es requerida';
      }

      return errors;
   };

   const handleCrearNuevaClase = (values: Partial<Class>) => {
      axiosInstance
         .post('/classes', values)
         .then(() => {
            setNewClassConfirmed(true);
            setTimeout(() => setNewClassConfirmed(false), 100);
            setShowNewClassModal(false);
         })
         .catch((err) => {
            alert(`Error al crear el nuevo ususario. ${err}`);
         });
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
         <div className=" p-6 rounded-lg w-[90%] max-w-xl shadow-xl flex flex-col items-center bg-gray-100">
            <h2 className="text-xl font-semibold mb-4">Crear nueva Clase</h2>

            <Formik
               initialValues={initialValues}
               validate={validate}
               onSubmit={(values) => handleCrearNuevaClase(values)}
            >
               {({ isSubmitting }) => (
                  <Form className="space-y-4 flex flex-col items-baseline">
                     <div>
                        <label>Titulo</label>
                        <Field
                           name="title"
                           className="input p-2 rounedm-md ms-4"
                        />
                        <ErrorMessage
                           name="title"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Descripción</label>
                        <Field
                           name="descripcion"
                           type="text"
                           className="input p-2 rounedm-md ms-4"
                        />
                        <ErrorMessage
                           name="descripcion"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Profesor</label>
                        <Field
                           as="select"
                           name="teacher"
                           className="input p-2 rounedm-md ms-4"
                        >
                           {teachers.map((profesor) => {
                              return (
                                 <option key={profesor.id} value={profesor.id}>
                                    {profesor.name}
                                 </option>
                              );
                           })}
                        </Field>
                        <ErrorMessage
                           name="teacher"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Categoría</label>
                        <Field
                           as="select"
                           name="category"
                           className="input p-2 rounedm-md ms-4"
                        >
                           {categorias.map((categoria) => {
                              return (
                                 <option
                                    key={categoria.id}
                                    value={categoria.id}
                                 >
                                    {categoria.name}
                                 </option>
                              );
                           })}
                        </Field>
                        <ErrorMessage
                           name="category"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Materia</label>
                        <Field
                           as="select"
                           name="materia"
                           className="input p-2 rounedm-md ms-4"
                        >
                           {materias.map((materia) => {
                              return (
                                 <option key={materia.id} value={materia.id}>
                                    {materia.name}
                                 </option>
                              );
                           })}
                        </Field>
                        <ErrorMessage
                           name="materia"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div className="flex justify-center gap-2 pt-4">
                        <button
                           type="button"
                           onClick={() => setShowNewClassModal(false)}
                           className="px-4 py-2 bg-gray-300 rounded"
                        >
                           Cancelar
                        </button>
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="px-4 py-2 bg-blue-400 text-white rounded"
                        >
                           Crear
                        </button>
                     </div>
                  </Form>
               )}
            </Formik>
         </div>
      </div>
   );
};

export default NewClassModal;
