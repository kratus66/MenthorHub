type UserDialogProps = {
   userQuestion: string;
};

const userData = JSON.parse(localStorage.getItem('user') ?? '{}');

const UserDialog = ({ userQuestion }: UserDialogProps) => {
   return (
      <>
         <div className="flex justify-end gap-2 w-3/4 self-end">
            <div>
               <p className="text-orange-500 text-lg text-end">
                  <i> Tu:</i>
               </p>
               <p className="bg-white text-orange-500 rounded-md p-2">
                  {userQuestion}
               </p>
            </div>
            <div className="rounded-full overflow-hidden h-fit">
               <img
                  src={userData.profileImage}
                  alt="ProfileImage"
                  className="w-[3rem] aspect-square"
               />
            </div>
         </div>
      </>
   );
};

export default UserDialog;
