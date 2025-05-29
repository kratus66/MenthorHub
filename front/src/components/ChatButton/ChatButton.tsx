type ChatButtonProps = {
   isWindowVisible: boolean;
   setIsWindowVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatButton = ({
   isWindowVisible,
   setIsWindowVisible,
}: ChatButtonProps) => {
   const handleOnClick = () => {
      isWindowVisible ? setIsWindowVisible(false) : setIsWindowVisible(true);
   };

   let buttonColor;
   isWindowVisible
      ? (buttonColor = 'bg-blue-600')
      : (buttonColor = 'bg-gray-100');

   let imageColor;
   isWindowVisible ? (imageColor = 'invert') : (imageColor = '');

   return (
      <>
         <button
            onClick={handleOnClick}
            className={`rounded-full overflow-hidden bottom-0 right-0 w-[6rem] h-[6rem] aspect-square ${buttonColor} drop-shadow-[0_10px_10px_rgba(0,0,0,0.50)] self-end me-4 hover:brightness-110 transition-colors duration-500`}
         >
            <img
               className={`w-full h-full p-5 ${imageColor} transition-colors duration-500`}
               src="/chatbot.svg"
               alt="ChatBot"
            />
         </button>
      </>
   );
};

export default ChatButton;
