// components/UserModal.tsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from '../../services/axiosInstance';
import type { User } from '../../interfaces/User';

type NewUserModalProps = {
   setNewUserConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
   setShowNewUserModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewUserModal = ({
   setNewUserConfirmed,
   setShowNewUserModal,
}: NewUserModalProps) => {
   const initialValues = {
      name: '',
      email: '',
      password: '',
      role: 'student',
      phoneNumber: '',
      country: '',
      provincia: '',
      localidad: '',
      createdAt: new Date().toISOString(),
   };

   const validate = (values: typeof initialValues) => {
      const errors: Partial<typeof initialValues> & { password?: string } = {};

      if (!values.name) errors.name = 'Requerido';
      if (!values.email) {
         errors.email = 'Requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
         errors.email = 'Email inválido';
      }
      if (!values.password) {
         errors.password = 'Requerido';
      } else if (values.password.length < 6) {
         errors.password = 'Mínimo 6 caracteres';
      }
      if (!['admin', 'teacher', 'student'].includes(values.role)) {
         errors.role = 'Rol inválido';
      }

      return errors;
   };

   const handleCrearNuevoUsuario = (values: User) => {
      axiosInstance
         .post('/users', values)
         .then(() => {
            setNewUserConfirmed(true);
            setTimeout(() => setNewUserConfirmed(false), 100);
            setShowNewUserModal(false);
         })
         .catch((err) => {
            alert(`Error al crear el nuevo ususario. ${err}`);
         });
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
         <div className=" p-6 rounded-lg w-[90%] max-w-xl shadow-xl flex flex-col items-center bg-gray-100">
            <h2 className="text-xl font-semibold mb-4">Crear nuevo usuario</h2>

            <Formik
               initialValues={initialValues}
               validate={validate}
               onSubmit={(values) => handleCrearNuevoUsuario(values)}
            >
               {({ isSubmitting }) => (
                  <Form className="space-y-4 flex flex-col items-baseline">
                     <div>
                        <label>Nombre</label>
                        <Field
                           name="name"
                           className="input p-2 rounedm-md ms-4"
                        />
                        <ErrorMessage
                           name="name"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Email</label>
                        <Field
                           name="email"
                           type="email"
                           className="input p-2 rounedm-md ms-4"
                        />
                        <ErrorMessage
                           name="email"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Contraseña</label>
                        <Field
                           name="password"
                           type="password"
                           className="input p-2 rounedm-md ms-4"
                        />
                        <ErrorMessage
                           name="password"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Rol</label>
                        <Field
                           as="select"
                           name="role"
                           className="input p-2 rounedm-md ms-4"
                        >
                           <option value="student">Estudiante</option>
                           <option value="teacher">Profesor</option>
                           <option value="admin">Administrador</option>
                        </Field>
                        <ErrorMessage
                           name="role"
                           component="div"
                           className="text-red-500 text-sm"
                        />
                     </div>

                     <div>
                        <label>Teléfono</label>
                        <Field
                           name="phoneNumber"
                           className="input p-2 rounedm-md ms-4"
                        />
                     </div>

                     <div>
                        <label>País</label>
                        <Field
                           name="country"
                           className="input p-2 rounedm-md ms-4"
                        />
                     </div>

                     <div>
                        <label>Localidad</label>
                        <Field
                           name="localidad"
                           className="input p-2 rounedm-md ms-4"
                        />
                     </div>

                     <div className="flex justify-center gap-2 pt-4">
                        <button
                           type="button"
                           onClick={() => setShowNewUserModal(false)}
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

export default NewUserModal;
