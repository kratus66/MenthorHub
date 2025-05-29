import { useState } from 'react';
import ChatbotOptions from '../ChatbotOptions/ChatbotOptions';
import UserDialog from '../UserDialog/UserDialog';
import ChatbotInitialQuestion from '../ChatbotInitialQuestion/ChatbotInitialQuestion';

type ChatWindowProps = {
   isWindowVisible: boolean;
};

const ChatWindow = ({ isWindowVisible }: ChatWindowProps) => {
   let windowVisibility;
   isWindowVisible
      ? (windowVisibility = 'opacity-100')
      : (windowVisibility = 'opacity-0');

   const [optionsVisible, setOptionsVisible] = useState(true);
   const [userDialog, setUserDialog] = useState(false);
   const [userQuestion, setUserQuestion] = useState('');

   return (
      <>
         <div
            className={`bg-[#F3F4F6] w-[25rem] rounded-lg ${windowVisibility} p-3 flex flex-col transition-opacity duration-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.50)]`}
         >
            <div className="flex flex-col items-start gap-2 w-3/4">
               <ChatbotInitialQuestion />
               {userDialog && <UserDialog userQuestion={userQuestion} />}
            </div>

            {optionsVisible && (
               <span className="flex flex-col justify-end">
                  <hr className="m-2 border-2" />
                  <ChatbotOptions
                     setOptionsVisible={setOptionsVisible}
                     setUserQuestion={setUserQuestion}
                     setUserDialog={setUserDialog}
                  />
               </span>
            )}
         </div>
      </>
   );
};

export default ChatWindow;
