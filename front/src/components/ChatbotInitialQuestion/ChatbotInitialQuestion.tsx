const ChatbotInitialQuestion = () => {
   return (
      <>
         <div className="flex items-start gap-2">
            <div className="bg-blue-600 p-1 rounded-full">
               <img src="/chatbot.svg" alt="Chatbot" className="invert" />
            </div>
            <div>
               <p className="text-blue-600 text-lg">
                  <i> Chatbot:</i>
               </p>
               <p className="bg-white rounded-md p-2">
                  Hola, soy Chatbot. ¿En qué te puedo ayudar?
               </p>
            </div>
         </div>
      </>
   );
};

export default ChatbotInitialQuestion;
