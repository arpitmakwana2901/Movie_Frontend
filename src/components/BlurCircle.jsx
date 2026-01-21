const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
}) => {
  return (
    <div
      className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none"
      style={{ 
        top: top, 
        left: left, 
        right: right, 
        bottom: bottom,
        zIndex: -1
      }}
    ></div>
  );
};

export default BlurCircle;
