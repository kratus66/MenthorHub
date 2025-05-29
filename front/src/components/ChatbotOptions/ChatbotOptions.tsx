type ChatbotOptionsProps = {
   setOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
   setUserQuestion: React.Dispatch<React.SetStateAction<string>>;
   setUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatbotOptions = ({
   setOptionsVisible,
   setUserQuestion,
   setUserDialog,
}: ChatbotOptionsProps) => {
   const questionButtonClasses =
      'bg-orange-500 text-white p-1 px-2 rounded-md hover:brightness-110';

   const userData = JSON.parse(localStorage.getItem('user') ?? '{}');

   const handleOptionChosen = (pregunta: string) => {
      setOptionsVisible(false);
      setUserDialog(true);
      setUserQuestion(pregunta);
   };
   return (
      <>
         <div className="self-end flex justify-end gap-1 w-3/4">
            <div className="flex flex-col gap-1">
               <p className="text-end text-orange-500">
                  <i>Tu:</i>
               </p>
               <button
                  onClick={() => handleOptionChosen('¿Cómo me registro?')}
                  className={questionButtonClasses}
               >
                  ¿Cómo me registro?
               </button>
               <button
                  onClick={() => handleOptionChosen('Cómo inicio sesión?')}
                  className={questionButtonClasses}
               >
                  Cómo inicio sesión?
               </button>
               <button
                  onClick={() => handleOptionChosen('Olvidé mi contraseña.')}
                  className={questionButtonClasses}
               >
                  Olvidé mi contraseña.
               </button>
               <button
                  onClick={() =>
                     handleOptionChosen('¿Cómo me inscribo a una clase?')
                  }
                  className={questionButtonClasses}
               >
                  ¿Cómo me inscribo a una clase?
               </button>
               <button
                  onClick={() => handleOptionChosen('¿Cómo creo una clase?')}
                  className={questionButtonClasses}
               >
                  ¿Cómo creo una clase?
               </button>
               <button
                  onClick={() => handleOptionChosen('¿Cómo subo una tarea?')}
                  className={questionButtonClasses}
               >
                  ¿Cómo subo una tarea?
               </button>
               <button
                  onClick={() =>
                     handleOptionChosen('¿Cómo veo mis calificaciones?')
                  }
                  className={questionButtonClasses}
               >
                  ¿Cómo veo mis calificaciones?
               </button>
               <button
                  onClick={() =>
                     handleOptionChosen(
                        '¿Cuánto cuesta la suscripción premium?'
                     )
                  }
                  className={questionButtonClasses}
               >
                  ¿Cuánto cuesta la suscripción premium?
               </button>
               <button
                  onClick={() =>
                     handleOptionChosen('¿Qué incluye la suscripción premium?')
                  }
                  className={questionButtonClasses}
               >
                  ¿Qué incluye la suscripción premium?
               </button>
               <button
                  onClick={() => handleOptionChosen('Tengo otro problema.')}
                  className={questionButtonClasses}
               >
                  Otros problemas.
               </button>
            </div>
            <div className="rounded-full overflow-hidden h-fit">
               <img
                  src={userData && userData.profileImage}
                  alt="Profile Image"
                  className="w-[3rem] aspect-square"
               />
            </div>
         </div>
      </>
   );
};

export default ChatbotOptions;
