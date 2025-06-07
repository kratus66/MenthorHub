import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Background/Background";
import LoginForm from "../../components/LoginForm/LoginForm";
import MenVir from "../../components/MenVir/MenVir";
import Chatbot from "../../components/Chatbot/Chatbot";

export default function Login() {
  const { user } = useUser();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "localhost:3001";
  const baseURL = `${window.location.protocol}//${apiUrl}/api`;

  if (user) {
    navigate("/panel");
    return null;
  }

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row items-center md:justify-end relative overflow-hidden">
   
      <div className="w-full md:w-[60%] h-full flex flex-col justify-start px-4 md:px-10">
        <h1 className="title leading-none pt-[9vh] text-center md:text-left">MentorHub</h1>
        <h2 className="subtitle z-10 text-center md:text-left">Ingreso</h2>

        <div className="flex w-full h-full overflow-hidden panel-text">
          <div className="flex flex-col justify-center items-center gap-6 w-full overflow-auto py-6">
            <LoginForm />

            <div className="flex flex-col gap-4 mt-4 w-full max-w-md">
              <p className="text-center">o continúa con</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a
                  href={`${baseURL}/auth/google`}
                  className="flex justify-center items-center px-10 py-2 rounded-full border-2 hover:border-[#007AFF]"
                >
                  <img
                    className="h-8 aspect-square"
                    src="/google-icon.svg"
                    alt="Google Sign In"
                  />
                </a>
                <a
                  href={`${baseURL}/auth/github`}
                  className="flex justify-center items-center px-10 py-2 rounded-full border-2 hover:border-[#007AFF]"
                >
                  <img
                    className="h-8 aspect-square"
                    src="/github-icon.svg"
                    alt="Github Sign In"
                  />
                </a>
              </div>
              <p className="text-center text-sm">
                ¿Aún no tienes cuenta?{" "}
                <a
                  className="text-[#007AFF] hover:underline underline-offset-2"
                  href="/register"
                >
                  Regístrate gratis.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="hidden md:block md:w-[40%] h-full">
        <Background>
          <MenVir src="/MenVir_Saludando.webm" />
        </Background>
      </div>

     
      <div className="absolute inset-0 flex flex-col items-center justify-center panel pointer-events-none" />

   
      <Chatbot />
    </div>
  );
}
