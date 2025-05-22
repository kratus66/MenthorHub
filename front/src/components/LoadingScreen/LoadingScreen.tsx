import Background from "../Background/Background";
import MenVir from "../MenVir/MenVir";

const LoadingScreen = () => (
  <div className="w-screen h-screen flex items-center justify-end overflow-hidden">
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="title text-center mb-4 text-[#007AFF] leading-none">MentorHub</h1>
      <div className="w-16 h-16 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#007AFF]">
        cargando y verificando la conexión...
      </p>
      <p className="text-[#007AFF]">
        En breve tendrás acceso a todas las herramientas para potenciar tu
        aprendizaje y mentoría.
      </p>
    </div>
    <Background>
      <MenVir src="/MenVir_Espera.webm" playbackRate={2} startTime={4}/>
    </Background>
  </div>
);

export default LoadingScreen;
