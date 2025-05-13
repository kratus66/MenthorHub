import { Formik, Form, Field, ErrorMessage } from 'formik';

interface LoginValues {
   email: string;
   password: string;
}

const initialValues: LoginValues = {
   email: '',
   password: '',
};

const validate = (values: LoginValues) => {
   const errors: Partial<LoginValues> = {};

   if (!values.email) {
      errors.email = 'El email es requerido';
   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Email inválido';
   }

   if (!values.password) {
      errors.password = 'La contraseña es requerida';
   } else if (values.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
   }

   return errors;
};

export default function LoginForm() {
   const handleSubmit = (values: LoginValues) => {
      console.log('Datos enviados:', values);
   };

   return (
      <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded">
         <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
         <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
         >
            <Form className="space-y-4">
               <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                     Email
                  </label>
                  <Field
                     name="email"
                     type="email"
                     className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                     name="email"
                     component="div"
                     className="text-red-500 text-sm"
                  />
               </div>

               <div>
                  <label
                     htmlFor="password"
                     className="block text-sm font-medium"
                  >
                     Contraseña
                  </label>
                  <Field
                     name="password"
                     type="password"
                     className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                     name="password"
                     component="div"
                     className="text-red-500 text-sm"
                  />
               </div>

               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
               >
                  Iniciar sesión
               </button>
            </Form>
         </Formik>
      </div>
   );
}
