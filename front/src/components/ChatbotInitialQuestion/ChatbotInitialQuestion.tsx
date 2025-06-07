const ChatbotInitialQuestion = () => {
  return (
    <>
      <div className="flex items-start gap-2 text-sm">
        <div className="bg-[#007AFF] rounded-full overflow-hidden">
          <img src="/chat-bot.svg" alt="Chatbot" className="w-[3rem] invert p-1" />
        </div>
        <div className="w-3/4">
          <p className="text-[#007AFF] text-lg">
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
