import { useState, useRef, useEffect } from 'react';
import ChatbotOptions from '../ChatbotOptions/ChatbotOptions';
import ChatbotInitialQuestion from '../ChatbotInitialQuestion/ChatbotInitialQuestion';
import axiosInstance from '../../services/axiosInstance';

type ChatWindowProps = {
   isWindowVisible: boolean;
   setIsWindowVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatWindow = ({
   isWindowVisible,
   setIsWindowVisible,
}: ChatWindowProps) => {
   const windowVisibility = isWindowVisible ? 'opacity-100' : 'opacity-0';
   const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
   const [optionsVisible, setOptionsVisible] = useState(true);
   const [chatLog, setChatLog] = useState<
      { sender: 'user' | 'bot'; text: string }[]
   >([]);

   const messagesEndRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [chatLog, optionsVisible]);

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

   const handleAnotherQuestion = (response: string) => {
      response === 'Yes' ? setOptionsVisible(true) : setIsWindowVisible(false);
   };

   return (
      <>
         <div
            className={`bg-[#F3F4F6] w-[25rem] rounded-lg ${windowVisibility} p-3 flex flex-col transition-opacity duration-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.50)] h-[592px] overflow-y-scroll`}
         >
            <div className="flex flex-col items-start gap-2 mb-10">
               <ChatbotInitialQuestion />
               {chatLog.map((msg, i) => (
                  <div
                     key={i}
                     className={`flex gap-2 mt-3 text-sm ${
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
                           className={`w-[3rem] object-cover`}
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
                           {msg.sender === 'bot' && (
                              <div>
                                 <br />
                                 <br />
                                 ¿Tienes alguna otra pregunta?
                                 <div className="flex justify-end gap-2">
                                    <button
                                       onClick={() =>
                                          handleAnotherQuestion('Yes')
                                       }
                                       className="p-1 px-3 bg-blue-500 text-white rounded-md hover:brightness-125"
                                    >
                                       Sí
                                    </button>
                                    <button
                                       onClick={() =>
                                          handleAnotherQuestion('No')
                                       }
                                       className="p-1 px-3 bg-blue-500 text-white  rounded-md hover:brightness-125"
                                    >
                                       No
                                    </button>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {optionsVisible && (
               <div className="flex flex-col gap-2 items-end mb-10">
                  <hr className="m-2 border-2" />
                  <ChatbotOptions onOptionSelect={handleUserChoice} />
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>
      </>
   );
};

export default ChatWindow;
