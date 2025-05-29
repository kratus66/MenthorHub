import { useState } from 'react';
import ChatbotOptions from '../ChatbotOptions/ChatbotOptions';
import ChatbotInitialQuestion from '../ChatbotInitialQuestion/ChatbotInitialQuestion';
import axiosInstance from '../../services/axiosInstance';

type ChatWindowProps = {
   isWindowVisible: boolean;
};

const ChatWindow = ({ isWindowVisible }: ChatWindowProps) => {
   const windowVisibility = isWindowVisible ? 'opacity-100' : 'opacity-0';
   const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
   const [optionsVisible, setOptionsVisible] = useState(true);
   const [chatLog, setChatLog] = useState<
      { sender: 'user' | 'bot'; text: string }[]
   >([]);

   const handleUserChoice = async (text: {
      frase: string;
      palabra: string;
   }) => {
      setOptionsVisible(false);
      setChatLog((prev) => [...prev, { sender: 'user', text: text.frase }]);

      try {
         const res = await axiosInstance.post('/chatbot/ask', {
            message: text.palabra,
         });
         const botResponse = res.data.response;
         setChatLog((prev) => [...prev, { sender: 'bot', text: botResponse }]);
      } catch (error) {
         setChatLog((prev) => [
            ...prev,
            { sender: 'bot', text: 'Error al contactar al bot. 😓' },
         ]);
      }
   };

   return (
      <>
         <div
            className={`bg-[#F3F4F6] w-[25rem] rounded-lg ${windowVisibility} p-3 flex flex-col transition-opacity duration-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.50)] h-[592px] overflow-y-scroll`}
         >
            <div className="flex flex-col items-start gap-2">
               <ChatbotInitialQuestion />
               {chatLog.map((msg, i) => (
                  <div
                     key={i}
                     className={`flex gap-2 mt-3 ${
                        msg.sender === 'user' && 'self-end justify-end'
                     }`}
                  >
                     <div
                        className={`rounded-full overflow-hidden w-[3rem] aspect-square h-fit bg-blue-600 ${
                           msg.sender === 'user' && 'order-last'
                        }`}
                     >
                        <img
                           src={`${
                              msg.sender === 'user'
                                 ? userData.profileImage
                                 : '/chatbot.jpg'
                           }`}
                           alt="Foto"
                           className={`w-[3rem] object-cover ${
                              msg.sender === 'bot' && ''
                           }`}
                        />
                     </div>
                     <div className="flex flex-col w-3/4">
                        <p
                           className={`text-blue-600 text-lg ${
                              msg.sender === 'user' &&
                              'text-end text-orange-500'
                           }`}
                        >
                           <i>{msg.sender === 'user' ? 'Tu:' : 'Chatbot'}</i>
                        </p>
                        <div
                           className={`p-2 rounded-md ${
                              msg.sender === 'user'
                                 ? 'bg-white self-end text-orange-500'
                                 : 'bg-white self-start'
                           }`}
                        >
                           {msg.text}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {optionsVisible && (
               <div className="flex flex-col gap-2 items-end">
                  <hr className="m-2 border-2" />
                  <ChatbotOptions onOptionSelect={handleUserChoice} />
               </div>
            )}
         </div>
      </>
   );
};

export default ChatWindow;
