import React from "react";
import MenVir from "../MenVir/MenVir";
import Background from "../Background/Background";

const ServerError: React.FC = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-end overflow-hidden">
      <div className="w-full h-full flex flex-col justify-start items-center py-[9vh]">
        <h1 className="title text-center leading-none">MentorHub</h1>
        <div className="h-full flex flex-col justify-center items-center subtitle text-center z-10 text-[#FF2D55]">
          <h2>
            <strong>Error 503:</strong> Servidor no disponible
          </h2>
          <h2>Por favor, inténtelo más tarde.</h2>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-fit px-6 py-3 rounded-full bg-[#FF2D55] text-white hover:bg-white hover:text-[#FF2D55] border-2 border-[#FF2D55]"
        >
          Actualizar
        </button>
      </div>
      <Background color="#FF2D55">
        <MenVir src="/MenVir_Error.webm" />
      </Background>
    </div>
  );
};

export default ServerError;
