type UserDialogProps = {
   userQuestion: string;
};

const UserDialog = ({ userQuestion }: UserDialogProps) => {
   return (
      <>
         <div className="flex items-end gap-2 w-3/4">
            <div className="text-orange-500 p-1 rounded-full">
               <img src="/chatbot.svg" alt="Chatbot" className="invert" />
            </div>
            <div>
               <p className="text-orange-500 text-lg">
                  <i> Tu:</i>
               </p>
               <p className="bg-white text-orange-500 rounded-md p-2">
                  {userQuestion}
               </p>
            </div>
         </div>
      </>
   );
};

export default UserDialog;
