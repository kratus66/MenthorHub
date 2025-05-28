import ChatButton from '../ChatButton/ChatButton';
import ChatWindow from '../ChatWindow/ChatWindow';

const Chatbot = () => {
   return (
      <>
         <div className="fixed">
            <ChatWindow />
            <ChatButton />
         </div>
      </>
   );
};

export default Chatbot;
