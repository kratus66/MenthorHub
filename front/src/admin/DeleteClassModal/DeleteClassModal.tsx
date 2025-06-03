import { useEffect, useState } from 'react';
import { formatearFecha } from '../helpers/formatoFecha';
import axiosInstance from '../../services/axiosInstance';
import type { Class } from '../../interfaces/Class';

type DeleteUserModalProps = {
   classToBeDeleted: Partial<Class>;
   showDeleteClassModal: boolean;
   setShowDeleteClassModal: React.Dispatch<React.SetStateAction<boolean>>;
   setClassIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteClassModal = ({
   classToBeDeleted,
   showDeleteClassModal,
   setShowDeleteClassModal,
   setClassIsDeleted,
}: DeleteUserModalProps) => {
   const [disabled, setDisabled] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setDisabled(false);
      }, 5000);

      return () => clearTimeout(timer);
   }, [showDeleteClassModal]);

   const handleCancel = () => {
      setShowDeleteClassModal(false);
   };

   const handleDelete = (id: string) => {
      axiosInstance
         .delete(`classes/${id}`)
         .then(() => {
            setClassIsDeleted((prev) => !prev);
            setShowDeleteClassModal(false);
         })
         .catch((err) => {
            alert(`Error al eliminar los datos: ${err}`);
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
                           <th className="w-[11rem] text-start p-2">Titulo</th>
                           <th className="w-[15rem] text-start p-2">
                              Descripción
                           </th>
                           <th className="w-[8rem] text-start p-2">Profesor</th>
                           <th className="w-[10rem] text-start p-2">
                              Categoría
                           </th>
                           <th className="w-[10rem] text-start p-2">Materia</th>
                           <th className="w-[10rem] text-start p-2">
                              Fecha Creación
                           </th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        <tr className="h-[3rem] hover:bg-gray-200">
                           <td className="p-2">{classToBeDeleted.title}</td>
                           <td className="p-2">
                              {classToBeDeleted.description}
                           </td>
                           <td className="p-2">
                              {classToBeDeleted.teacher?.name}
                           </td>
                           <td className="p-2">
                              {classToBeDeleted.category?.name}
                           </td>
                           <td className="w-[10rem] text-start truncate p-2">
                              {classToBeDeleted.materia?.name}
                           </td>
                           <td className="p-2">
                              {formatearFecha(classToBeDeleted.createdAt ?? '')}
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
                     onClick={() => handleDelete(classToBeDeleted.id ?? '')}
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

export default DeleteClassModal;
