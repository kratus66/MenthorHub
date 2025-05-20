import Background from "../../components/Background/Background";
import LoginForm from "../../components/LoginForm/LoginForm";
import MenVir from "../../components/MenVir/MenVir";

export default function Login() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full h-full flex flex-col gap-4 justify-between ps-[8rem] pe-[14rem]">
        <h1 className="text-8xl">MentorHub</h1>
        <h2 className="text-5xl">Ingreso</h2>
        <LoginForm />
        <div className="flex flex-col gap-4 mt-8">
          <p className="w-fit self-center">o continúa con</p>
          <div className="flex justify-center gap-4">
            <a href="" className="px-14 py-2 rounded-full border">
              <img
                width={30}
                height={30}
                src="/google-icon.svg"
                alt="Google Sign In"
              />
            </a>
            <a href="" className="px-14 py-2 rounded-full border">
              <img
                width={30}
                height={30}
                src="/github-icon.svg"
                alt="Github Sign In"
              />
            </a>
            <a href="" className="px-14 py-2 rounded-full border">
              <img
                width={30}
                height={30}
                src="/facebook-icon.svg"
                alt="Facebook Sign In"
              />
            </a>
          </div>
          <p className="w-fit self-center">
            ¿Aun no tienes cuenta? <a href="/register">Registrate gratis.</a>
          </p>
        </div>
      </div>
      <Background>
        <MenVir className="-left-60" src="/MenVir_Saludando.webm" />
      </Background>
    </div>
  );
}
