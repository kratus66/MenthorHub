const ChatbotInitialQuestion = () => {
   return (
      <>
         <div className="flex items-start gap-2 text-sm">
            <div className="bg-blue-600 rounded-full overflow-hidden">
               <img src="/chatbot.jpg" alt="Chatbot" className="w-[3rem]" />
            </div>
            <div className="w-3/4">
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
