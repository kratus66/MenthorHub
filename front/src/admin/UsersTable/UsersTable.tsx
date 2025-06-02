import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import type { User } from '../../interfaces/User';
import { formatearFecha } from '../helpers/formatoFecha';

type UsersTableProps = {
   setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
   setUserToBeDeleted: React.Dispatch<React.SetStateAction<User>>;
   userIsDeleted: boolean;
};

type UsersPaginados = {
   data: User[];
   limit: number;
   page: number;
   total: number;
};

const UsersTable = ({
   setShowDeleteModal,
   setUserToBeDeleted,
   userIsDeleted,
}: UsersTableProps) => {
   const [users, setUsers] = useState<UsersPaginados>({
      data: [],
      limit: 0,
      page: 0,
      total: 0,
   });
   const [dataToBeEdited, setDataToBeEdited] = useState<User>({});
   const [editionConfirmed, setEditionConfirmed] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);

   useEffect(() => {
      axiosInstance
         .get(`/users?page=${currentPage}`)
         .then((res) => {
            setUsers(res.data);
         })
         .catch((err) => {
            console.log('Error al cargar las clases', err);
         });
   }, [userIsDeleted, editionConfirmed, currentPage]);

   const handleDeleteData = (user: User) => {
      setShowDeleteModal(true);
      setUserToBeDeleted(user);
   };

   const handleEditData = (user: User) => {
      setDataToBeEdited({ ...user });
   };

   const handleConfirmEdition = () => {
      axiosInstance
         .put(`users/${dataToBeEdited.id}`, dataToBeEdited)
         .then((res) => {
            setEditionConfirmed(true);
            setDataToBeEdited({});
            setTimeout(() => setEditionConfirmed(false), 100);
         })
         .catch((err) => {
            alert(`Error al editar los datos. ${err}`);
         });
   };

   return (
      <>
         <div className="p-4 w-full">
            <h2 className="text-3xl mb-4">Usuarios</h2>
            <hr className="border-2 border-black" />
            <div className="flex items-center my-2 gap-4">
               <button className="bg-blue-400 p-2 rounded-md text-white me-[16rem]">
                  Nuevo Usuario
               </button>
               <button
                  onClick={() =>
                     setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
               >
                  ◀
               </button>

               <span className="text-sm">
                  Página {users.page} de{' '}
                  {Math.ceil(users.total / users.limit) || 1}
               </span>

               <button
                  onClick={() =>
                     setCurrentPage((prev) =>
                        prev < Math.ceil(users.total / users.limit)
                           ? prev + 1
                           : prev
                     )
                  }
                  disabled={currentPage >= Math.ceil(users.total / users.limit)}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
               >
                  ▶
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="table-fixed w-full">
                  <thead className="h-[3rem] bg-blue-200">
                     <tr>
                        <th className="w-[11rem] text-start p-2">Nombre</th>
                        <th className="w-[15rem] text-start p-2">Email</th>
                        <th className="w-[8rem] text-start p-2">Rol</th>
                        <th className="w-[10rem] text-start p-2">Teléfono</th>
                        <th className="w-[10rem] text-start p-2">Foto</th>
                        <th className="w-[10rem] text-start p-2">Pais</th>
                        <th className="w-[12rem] text-start p-2">Localidad</th>
                        <th className="w-[10rem] text-start p-2">Premium</th>
                        <th className="w-[10rem] text-start p-2">
                           Fecha Registro
                        </th>
                        <th className="w-[10rem] text-start p-2"></th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {users.data.map((user, index) => {
                        return dataToBeEdited?.id !== user.id ? (
                           <tr
                              className="h-[3rem] hover:bg-gray-200"
                              key={user.id}
                           >
                              <td className="p-2">{user.name}</td>
                              <td className="p-2">{user.email}</td>
                              <td className="p-2">{user.role}</td>
                              <td className="p-2">{user.phoneNumber}</td>
                              <td className="w-[10rem] text-start truncate p-2">
                                 {user.profileImage}
                              </td>
                              <td className="p-2">{user.country}</td>
                              <td className="truncate p-2">{user.localidad}</td>
                              <td className="text-orange-600 p-2">
                                 {user.isPaid && 'Premium'}
                              </td>
                              <td className="p-2">
                                 {formatearFecha(user.createdAt ?? '')}
                              </td>
                              <td>
                                 <button
                                    className="bg-blue-400 rounded-md m-2"
                                    onClick={() => handleEditData(user ?? '')}
                                 >
                                    <img
                                       src="/icons/editar.svg"
                                       alt="Editar"
                                       className="p-2 w-10 invert"
                                    />
                                 </button>
                                 <button
                                    className="bg-red-400 rounded-md m-2"
                                    onClick={() => handleDeleteData(user)}
                                 >
                                    <img
                                       src="/icons/borrar.svg"
                                       alt="Borrar"
                                       className="p-2 w-10 invert"
                                    />
                                 </button>
                              </td>
                           </tr>
                        ) : (
                           <tr
                              className="h-[3rem] hover:bg-gray-200"
                              key={index}
                           >
                              <td className="p-2 px-0">
                                 <input
                                    type="text"
                                    value={dataToBeEdited.name}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? { ...prev, name: e.target.value }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md"
                                 />
                              </td>
                              <td className="p-2 px-0">
                                 <input
                                    type="text"
                                    value={dataToBeEdited.email}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  email: e.target.value,
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md"
                                 />
                              </td>
                              <td className="p-2 px-0">
                                 <select
                                    value={dataToBeEdited?.role ?? ''}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? { ...prev, role: e.target.value }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md"
                                 >
                                    <option value="admin">Admin</option>
                                    <option value="alumno">Alumno</option>
                                    <option value="profesor">Profesor</option>
                                 </select>
                              </td>
                              <td className="p-2">
                                 <input
                                    type="text"
                                    value={dataToBeEdited.phoneNumber}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  phoneNumber: e.target.value,
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md"
                                 />
                              </td>
                              <td className="w-[10rem] text-start truncate p-2">
                                 {user.profileImage}
                              </td>
                              <td className="p-2 px-0">
                                 <input
                                    type="text"
                                    value={dataToBeEdited.country}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  country: e.target.value,
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md w-[8rem]"
                                 />
                              </td>
                              <td className="truncate p-2 px-0">
                                 <input
                                    type="text"
                                    value={dataToBeEdited.localidad}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  localidad: e.target.value,
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md w-[8rem]"
                                 />
                              </td>
                              <td className="p-2">
                                 <input
                                    type="checkbox"
                                    checked={!!dataToBeEdited?.isPaid}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  isPaid: e.target.checked,
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 scale-150"
                                 />
                              </td>
                              <td className="p-2">
                                 {formatearFecha(user.createdAt ?? '')}
                              </td>
                              <td>
                                 <button
                                    className="bg-green-400 rounded-md m-2 p-2 text-white"
                                    onClick={handleConfirmEdition}
                                 >
                                    Guardar Cambios
                                 </button>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </>
   );
};

export default UsersTable;
