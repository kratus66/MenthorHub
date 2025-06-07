import { useEffect, useState } from 'react';
import type { User } from '../../interfaces/User';
import { formatearFecha } from '../helpers/formatoFecha';
import axiosInstance from '../../services/axiosInstance';

type DeleteUserModalProps = {
   userToBeDeleted: User;
   showDeleteModal: boolean;
   setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
   setUserIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteUserModal = ({
   userToBeDeleted,
   showDeleteModal,
   setShowDeleteModal,
   setUserIsDeleted,
}: DeleteUserModalProps) => {
   const [disabled, setDisabled] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setDisabled(false);
      }, 5000);

      return () => clearTimeout(timer);
   }, [showDeleteModal]);

   const handleCancel = () => {
      setShowDeleteModal(false);
   };

   const handleDelete = (id: string) => {
      axiosInstance
         .delete(`users/${id}`)
         .then(() => {
            setUserIsDeleted((prev) => !prev);
            setShowDeleteModal(false);
         })
         .catch((err) => {
            console.log('Error al eliminar los datos', err);
         });
   };

   return (
      <>
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-4 max-w-[60rem] flex flex-col justify-center shadow-xl border-4 border-red-400">
               <h2 className="text-center w-1/2 self-center m-4">
                  Si continúas se borrarán <b>definitivamente</b> los datos de
                  la Base de Datos.
                  <b>
                     <span className="underline">
                        Esta accion no es reversible.
                     </span>
                  </b>
               </h2>
               <div className="overflow-x-auto m-6 border border-black shadow-xl">
                  <table className="table-fixed w-full">
                     <thead className="h-[3rem] bg-blue-200">
                        <tr>
                           <th className="w-[11rem] text-start p-2">Nombre</th>
                           <th className="w-[15rem] text-start p-2">Email</th>
                           <th className="w-[8rem] text-start p-2">Rol</th>
                           <th className="w-[10rem] text-start p-2">
                              Teléfono
                           </th>
                           <th className="w-[10rem] text-start p-2">Foto</th>
                           <th className="w-[10rem] text-start p-2">Pais</th>
                           <th className="w-[12rem] text-start p-2">
                              Localidad
                           </th>
                           <th className="w-[10rem] text-start p-2">Premium</th>
                           <th className="w-[10rem] text-start p-2">
                              Fecha Registro
                           </th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        <tr className="h-[3rem] hover:bg-gray-200">
                           <td className="p-2">{userToBeDeleted.name}</td>
                           <td className="p-2">{userToBeDeleted.email}</td>
                           <td className="p-2">{userToBeDeleted.role}</td>
                           <td className="p-2">
                              {userToBeDeleted.phoneNumber}
                           </td>
                           <td className="w-[10rem] text-start truncate p-2">
                              {userToBeDeleted.profileImage}
                           </td>
                           <td className="p-2">{userToBeDeleted.country}</td>
                           <td className="truncate p-2">
                              {userToBeDeleted.localidad}
                           </td>
                           <td className="text-yellow-500 p-2">
                              {userToBeDeleted.isPaid && 'Premium'}
                           </td>
                           <td className="p-2">
                              {formatearFecha(userToBeDeleted.createdAt ?? '')}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               <div className="flex justify-center gap-10 m-4">
                  <button
                     className={`text-white p-3 rounded-md transition ${
                        disabled
                           ? 'bg-red-400 cursor-not-allowed opacity-35'
                           : 'bg-red-600 hover:brightness-110'
                     }`}
                     disabled={disabled}
                     onClick={() => handleDelete(userToBeDeleted.id ?? '')}
                  >
                     Eliminar
                  </button>
                  <button
                     className="bg-gray-400 text-white p-3 rounded-md hover:brightness-110"
                     onClick={handleCancel}
                  >
                     Cancelar
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default DeleteUserModal;
