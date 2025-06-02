import { useState } from 'react';
import AdminNavBar from './AdminNavBar/AdminNavBar';
import Stats from './Stats/Stats';
import ClassesTable from './ClassesTable/ClassesTable';
import UsersTable from './UsersTable/UsersTable';
import type { User } from '../interfaces/User';
import DeleteUserModal from './DeleteUserModal/DeleteUserModal';
import NewUserModal from './NewUserModal/NewUserModal';

const AdminPanel = () => {
   const [activeTab, setActiveTab] = useState('estadisticas');
   const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
   const [showNewUserModal, setShowNewUserModal] = useState(false);
   const [userToBeDeleted, setUserToBeDeleted] = useState<User>({});
   const [userIsDeleted, setUserIsDeleted] = useState(false);
   const [newUserConfirmed, setNewUserConfirmed] = useState(false);

   const adminTabs = [
      { id: 'estadisticas', label: 'Estadísticas' },
      { id: 'clases', label: 'Clases' },
      { id: 'usuarios', label: 'Usuarios' },
   ];

   return (
      <>
         <AdminNavBar />
         <div className="w-full h-screen px-10 flex">
            <div className="flex flex-col w-1/5 bg-gray-200">
               {adminTabs.map((tab, index) => {
                  return (
                     <button
                        key={index}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-4 w-full text-left text-xl hover:bg-gray-200 inline transition ${
                           activeTab === tab.id
                              ? 'bg-blue-400 hover:bg-blue-400 font-semibold text-white'
                              : 'text-gray-700'
                        }`}
                     >
                        <img
                           src={`/icons/${tab.id}.svg`}
                           alt="Icon"
                           className="inline me-2"
                        />
                        {tab.label}
                     </button>
                  );
               })}
            </div>
            <div className="w-4/5 bg-gray-100">
               {activeTab === 'estadisticas' && <Stats />}
               {activeTab === 'clases' && <ClassesTable />}
               {activeTab === 'usuarios' && (
                  <UsersTable
                     setShowDeleteModal={setShowDeleteUserModal}
                     setUserToBeDeleted={setUserToBeDeleted}
                     userIsDeleted={userIsDeleted}
                     setShowNewUserModal={setShowNewUserModal}
                     newUserConfirmed={newUserConfirmed}
                  />
               )}
            </div>
            {showDeleteUserModal === true && (
               <DeleteUserModal
                  userToBeDeleted={userToBeDeleted}
                  showDeleteModal={showDeleteUserModal}
                  setShowDeleteModal={setShowDeleteUserModal}
                  setUserIsDeleted={setUserIsDeleted}
               />
            )}
            {showNewUserModal === true && (
               <NewUserModal
                  setNewUserConfirmed={setNewUserConfirmed}
                  setShowNewUserModal={setShowNewUserModal}
               />
            )}
         </div>
      </>
   );
};

export default AdminPanel;
