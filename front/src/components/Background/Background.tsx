interface BackgroundProps {
  children?: React.ReactNode;
  color?: string;
}

const Background = ({ color = "#007AFF", children }: BackgroundProps) => {
  return (
    <div className="h-full">
      <div className="absolute z-50 h-full w-fit">{children}</div>
      <div
        style={{ backgroundColor: color + "BF" }}
        className="h-full aspect-[630/982] relative bg-opacity-75 -z-1 bg-black"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-full -z-1"
        >
          <path d="M100,0 Q90,90 0,100 L0,0 Z" fill={color} />
        </svg>
      </div>
    </div>
  );
};

export default Background;
