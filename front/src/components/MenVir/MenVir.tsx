import React, { type RefObject } from "react";

interface VideoContainerProps {
  className?: string; // Para agregar más clases al div contenedor
  videoRef?: RefObject<HTMLVideoElement | null>; // Opcional
  onEnded?: () => void; // Opcional
  src: string; // Obligatorio
  loop?: boolean; // Opcional con valor por defecto true
}

const MenVir: React.FC<VideoContainerProps> = ({
  className = "",
  videoRef,
  onEnded,
  src,
  loop = true,
}) => {
  return (
    <div className="h-full aspect-[630/982] absolute">
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-center w-full h-full ${className}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop={loop}
          onEnded={onEnded}
          src={src}
          className="w-[90%] h-[90%] object-contain"
        />
      </div>
    </div>
  );
};

export default MenVir;
