import { useState } from 'react';
import ChatButton from '../ChatButton/ChatButton';
import ChatWindow from '../ChatWindow/ChatWindow';

const Chatbot = () => {
   const [isWindowVisible, setIsWindowVisible] = useState(false);

   return (
      <>
         <div className="fixed w-fit min-h-[10rem] bottom-0 right-0 flex justify-end mb-6 p-2 gap-4 z-50">
            <ChatWindow
               isWindowVisible={isWindowVisible}
               setIsWindowVisible={setIsWindowVisible}
            />
            <ChatButton
               isWindowVisible={isWindowVisible}
               setIsWindowVisible={setIsWindowVisible}
            />
         </div>
      </>
   );
};

export default Chatbot;
