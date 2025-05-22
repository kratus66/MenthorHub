import React, { useEffect, type RefObject } from "react";

interface VideoContainerProps {
  className?: string; // Para agregar más clases al div contenedor
  videoRef?: RefObject<HTMLVideoElement | null>; // Opcional
  onEnded?: () => void; // Opcional
  src: string; // Obligatorio
  loop?: boolean; // Opcional con valor por defecto true
  playbackRate?: number; // Opcional con valor por defecto 1
  startTime?: number; // Tiempo de inicio opcional (por defecto 0)
}

const MenVir: React.FC<VideoContainerProps> = ({
  className = "",
  videoRef,
  onEnded,
  src,
  loop = true,
  playbackRate = 1, // Valor por defecto 1 (normal)
  startTime = 0, // Comienza en el segundo 0 por defecto
}) => {
  useEffect(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.playbackRate = playbackRate;
      videoElement.currentTime = startTime;
    }
  }, [playbackRate]);

  return (
    <div className="h-full aspect-[630/982] absolute">
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-center w-full h-full pt-[20vh] ${className}`}
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
