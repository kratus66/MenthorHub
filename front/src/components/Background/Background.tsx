interface BackgroundProps {
  children?: React.ReactNode;
}

const Background = ({ children }: BackgroundProps) => {
  return (
    <div className="h-full">
      <div className="absolute z-50 h-full w-full">{children}</div>
      <div className="h-full aspect-[630/982] bg-[#007AFF] relative bg-opacity-75 -z-1">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-full -z-1"
        >
          <path d="M100,0 Q90,90 0,100 L0,0 Z" fill="#007AFF" />
        </svg>
      </div>
    </div>
  );
};

export default Background;
