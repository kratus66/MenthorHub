type ChatbotOptionsProps = {
   onOptionSelect: (text: { frase: string; palabra: string }) => void;
};

const ChatbotOptions = ({ onOptionSelect }: ChatbotOptionsProps) => {
   const questionButtonClasses =
      'bg-orange-500 text-white p-1 px-2 rounded-md hover:brightness-110';

   const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
   const options = [
      { frase: '¿Cómo me registro?', palabra: 'registro' },
      { frase: '¿Cómo inicio sesión?', palabra: 'login' },
      { frase: 'Olvidé mi contraseña.', palabra: 'olvide contrasena' },
      { frase: '¿Cómo me inscribo a una clase?', palabra: 'inscribir' },
      { frase: '¿Cómo creo una clase?', palabra: 'crear clase' },
      { frase: '¿Cómo subo una tarea?', palabra: 'subir tarea' },
      { frase: '¿Cómo veo mis calificaciones?', palabra: 'ver calificaciones' },
      { frase: '¿Cuánto cuesta la suscripción premium?', palabra: 'precio' },
      { frase: '¿Qué incluye la suscripción premium?', palabra: 'que incluye' },
      { frase: 'Otros problemas.', palabra: 'ayuda' },
   ];

   return (
      <>
         <div className="flex justify-end w-3/4 gap-2">
            <div className="flex flex-col gap-1">
               <p className="text-orange-500 text-end">
                  <i>Tu:</i>
               </p>
               {options.map((option, index) => (
                  <button
                     key={index}
                     onClick={() => onOptionSelect(option)}
                     className={questionButtonClasses}
                  >
                     {option.frase}
                  </button>
               ))}
            </div>
            <div className="rounded-full overflow-hidden h-fit">
               <img
                  src={userData.profileImage}
                  alt="Foto de Perfil"
                  className="w-[3rem]"
               />
            </div>
         </div>
      </>
   );
};

export default ChatbotOptions;
