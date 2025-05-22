import { Formik, Form, Field, ErrorMessage } from "formik";

interface LoginValues {
  email: string;
  password: string;
}

const initialValues: LoginValues = {
  email: "",
  password: "",
};

const validate = (values: LoginValues) => {
  const errors: Partial<LoginValues> = {};

  if (!values.email) {
    errors.email = "El email es requerido";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Email inválido";
  }

  if (!values.password) {
    errors.password = "La contraseña es requerida";
  } else if (values.password.length < 6) {
    errors.password = "Mínimo 6 caracteres";
  }

  return errors;
};

export default function LoginForm() {
  const handleSubmit = () => {};

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      <Form className="flex flex-col justify-between gap-[1.7vh]">
        <h2 className="subtitle z-10">Ingreso</h2>
        <div className="mx-[2vw]">
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <div className="relative">
            <Field
              name="email"
              id="email"
              type="email"
              placeholder="nombre123@correo.com"
              className="w-full py-[0.8vw] px-[1vw] border rounded-full"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="h-fit my-auto mr-[1vw] absolute inset-y-0 right-0 text-[#FF2D55] text-[2.8vh]"
            />
          </div>
        </div>

        <div className="relative mx-[2vw]">
          <label htmlFor="password" className="block font-medium">
            Contraseña
          </label>
          <div className="relative">
            <Field
              name="password"
              id="password"
              type="password"
              placeholder="Contraseña"
              className="w-full py-[0.8vw] px-[1vw] border rounded-full"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="h-fit my-auto mr-[1vw] absolute inset-y-0 right-0 text-[#FF2D55] text-[2.8vh]"
            />
          </div>
        </div>
        <a className="text-right mx-[2vw] text-[#007AFF] hover:underline underline-offset-2">¿Has olvidado tu contraseña?</a>
        <button
          type="submit"
          className="w-full bg-[#007AFF] text-white mx-auto py-3 px-6 rounded-full hover:bg-white hover:text-[#007AFF] border-2 border-[#007AFF]"
        >
          Iniciar sesión
        </button>
      </Form>
    </Formik>
  );
}
