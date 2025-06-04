import { useEffect, useState } from 'react';
import AdminNavBar from './AdminNavBar/AdminNavBar';
import Stats from './Stats/Stats';
import ClassesTable from './ClassesTable/ClassesTable';
import UsersTable from './UsersTable/UsersTable';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
   const [activeTab, setActiveTab] = useState('estadisticas');

   const adminTabs = [
      { id: 'estadisticas', label: 'Estadísticas' },
      { id: 'clases', label: 'Clases' },
      { id: 'usuarios', label: 'Usuarios' },
   ];

   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/login');
      }
   }, [navigate]);

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
               {activeTab === 'usuarios' && <UsersTable />}
            </div>
         </div>
      </>
   );
};

export default AdminPanel;
