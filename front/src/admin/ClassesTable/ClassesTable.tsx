import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { formatearFecha } from '../helpers/formatoFecha';
import type { clasesType } from '../../types/ClassType';
import type { CategoryType } from '../../types/CategoryType';
import type { MateriaType } from '../../types/MateriaType';
import type { Teacher } from '../../types/entities';
import type { Class } from '../../interfaces/Class';
import DeleteClassModal from '../DeleteClassModal/DeleteClassModal';
import NewClassModal from '../NewClassModal/NewClassModal';

type ClasesPaginadas = {
   data: clasesType[];
   lastPage: number;
   page: number;
   total: number;
};

const ClassesTable = () => {
   const [clases, setClases] = useState<ClasesPaginadas>({
      data: [],
      total: 1,
      page: 1,
      lastPage: 0,
   });
   const [dataToBeEdited, setDataToBeEdited] = useState<clasesType | null>(
      null
   );
   const [editionConfirmed, setEditionConfirmed] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
   const [classToBeDeleted, setClassToBeDeleted] = useState<Partial<Class>>({});
   const [classIsDeleted, setClassIsDeleted] = useState(false);
   const [showNewClassModal, setShowNewClassModal] = useState(false);
   const [newClassConfirmed, setNewClassConfirmed] = useState(false);
   const [categorias, setCategorias] = useState<CategoryType[]>([]);
   const [materias, setMaterias] = useState<MateriaType[]>([]);
   const [teachers, setTeachers] = useState<Teacher[]>([]);

   const filters = {
      search: '',
      category: '',
      teacherId: '',
      materiaId: '',
      sortBy: 'title',
      sortOrder: 'asc',
   };

   useEffect(() => {
      axiosInstance
         .get('/categories')
         .then((res) => {
            setCategorias(res.data.data);
         })
         .catch((err) => {
            alert(`Error al traer las categorias: ${err}`);
         });
   }, []);

   useEffect(() => {
      axiosInstance
         .get('/materias')
         .then((res) => {
            setMaterias(res.data);
         })
         .catch((err) => {
            alert(`Error al traer las materias: ${err}`);
         });
   }, []);

   useEffect(() => {
      axiosInstance
         .get('/users/teacher')
         .then((res) => {
            setTeachers(res.data.data);
         })
         .catch((err) => {
            alert(`Error al traer las categorias: ${err}`);
         });
   }, []);

   useEffect(() => {
      axiosInstance
         .post(`/filters`, filters)
         .then((res) => {
            console.log(res.data);
            setClases(res.data);
         })
         .catch((err) => {
            console.log('Error al cargar las clases', err);
         });
   }, [editionConfirmed, classIsDeleted, newClassConfirmed]);

   const handleDeleteClassData = (clase: clasesType) => {
      setShowDeleteClassModal(true);
      setClassToBeDeleted(clase);
   };

   const handleEditData = (clases: clasesType) => {
      setDataToBeEdited({ ...clases });
   };

   const handleConfirmEdition = () => {
      if (!dataToBeEdited) return;

      console.log('Body del Request edit Clase:', {
         title: dataToBeEdited.title,
         description: dataToBeEdited.description,
         teacherId: dataToBeEdited.teacher?.id,
         categoryId: dataToBeEdited.category?.id,
      });

      console.log('dataToBeEdited:', dataToBeEdited);

      axiosInstance
         .put(`classes/${dataToBeEdited.id}`, {
            title: dataToBeEdited.title,
            description: dataToBeEdited.description,
            teacherId: dataToBeEdited.teacher?.id,
            categoryId: dataToBeEdited.category?.id,
         })
         .then(() => {
            setEditionConfirmed(true);
            setDataToBeEdited(null);
            setTimeout(() => setEditionConfirmed(false), 100);
         })
         .catch((err) => {
            alert(`Error al editar los datos. ${err}`);
         });
   };

   const handleNuevaClase = () => {
      setShowNewClassModal(true);
   };

   return (
      <>
         <div className="p-4 w-full">
            <h2 className="text-3xl mb-4">Clases</h2>
            <hr className="border-2 border-black" />
            <div className="flex items-center my-2 gap-4">
               <button
                  className="bg-blue-400 p-2 rounded-md text-white me-[16rem]"
                  onClick={handleNuevaClase}
               >
                  Nueva Clase
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
                  Página {clases.page} de {clases.lastPage}
               </span>

               <button
                  onClick={() =>
                     setCurrentPage((prev) =>
                        prev < Math.ceil(clases.total / clases.lastPage)
                           ? prev + 1
                           : prev
                     )
                  }
                  disabled={
                     currentPage >= Math.ceil(clases.total / clases.lastPage)
                  }
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
               >
                  ▶
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="table-fixed w-full">
                  <thead className="h-[3rem] bg-blue-200">
                     <tr>
                        <th className="w-[11rem] text-start p-2">Titulo</th>
                        <th className="w-[15rem] text-start p-2">
                           Descripcion
                        </th>
                        <th className="w-[12rem] text-start p-2">Profesor</th>
                        <th className="w-[12rem] text-start p-2">Categoria</th>
                        <th className="w-[12rem] text-start p-2">Materia</th>
                        <th className="w-[10rem] text-start p-2">
                           Fecha Creación
                        </th>
                        <th className="w-[10rem] text-start p-2"></th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {clases.data.map((clase) => {
                        return dataToBeEdited?.id !== clase.id ? (
                           <tr
                              className="h-[3rem] hover:bg-gray-200"
                              key={clase.id}
                           >
                              <td className="p-2">{clase.title}</td>
                              <td className="p-2">{clase.description}</td>
                              <td className="p-2">{clase.teacher.name}</td>
                              <td className="p-2">{clase.category.name}</td>
                              <td className="p-2">{clase.materia.name}</td>
                              <td className="p-2">
                                 {formatearFecha(clase.createdAt ?? '')}
                              </td>
                              <td>
                                 <button
                                    className="bg-blue-400 rounded-md m-2"
                                    onClick={() => handleEditData(clase ?? '')}
                                 >
                                    <img
                                       src="/icons/editar.svg"
                                       alt="Editar"
                                       className="p-2 w-10 invert"
                                    />
                                 </button>
                                 <button
                                    className="bg-red-400 rounded-md m-2"
                                    onClick={() => handleDeleteClassData(clase)}
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
                              key={clase.id}
                           >
                              <td className="p-2 px-0">
                                 <input
                                    type="text"
                                    value={dataToBeEdited.title}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  title: e.target.value,
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md"
                                 />
                              </td>
                              <td className="p-2 px-0">
                                 <input
                                    type="text"
                                    value={dataToBeEdited.description}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  description: e.target.value,
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md"
                                 />
                              </td>
                              <td className="p-2 px-0">
                                 <select
                                    value={dataToBeEdited?.teacher.id ?? ''}
                                    onChange={(e) => {
                                       const selectedTeacher = teachers.find(
                                          (teacher) =>
                                             teacher.id === e.target.value
                                       );
                                       setDataToBeEdited((prev) =>
                                          prev && selectedTeacher
                                             ? {
                                                  ...prev,
                                                  teacher: selectedTeacher,
                                               }
                                             : prev
                                       );
                                    }}
                                    className="p-2 rounded-md w-[10rem]"
                                 >
                                    {teachers.map((teacher) => {
                                       return (
                                          <option
                                             key={teacher.id}
                                             value={teacher.id}
                                          >
                                             {teacher.name}
                                          </option>
                                       );
                                    })}
                                 </select>
                              </td>
                              <td className="p-2 px-0">
                                 <select
                                    value={dataToBeEdited?.category.id ?? ''}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  category: {
                                                     ...prev.category,
                                                     id: e.target.value,
                                                  },
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md w-[10rem]"
                                 >
                                    {categorias.map((categoria) => {
                                       return (
                                          <option
                                             key={categoria.id}
                                             value={categoria.id}
                                          >
                                             {categoria.name}
                                          </option>
                                       );
                                    })}
                                 </select>
                              </td>
                              <td className="p-2 px-0">
                                 <select
                                    value={dataToBeEdited?.materia.id ?? ''}
                                    onChange={(e) =>
                                       setDataToBeEdited((prev) =>
                                          prev
                                             ? {
                                                  ...prev,
                                                  materia: {
                                                     ...prev.materia,
                                                     id: e.target.value,
                                                  },
                                               }
                                             : prev
                                       )
                                    }
                                    className="p-2 rounded-md w-[10rem]"
                                 >
                                    {materias.map((materia) => {
                                       return (
                                          <option
                                             key={materia.id}
                                             value={materia.id}
                                          >
                                             {materia.name}
                                          </option>
                                       );
                                    })}
                                 </select>
                              </td>
                              <td className="p-2">
                                 {formatearFecha(clase.createdAt ?? '')}
                              </td>
                              <td>
                                 <button
                                    className="bg-green-600 rounded-md m-2 p-2 text-white"
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
            {showDeleteClassModal === true && (
               <DeleteClassModal
                  classToBeDeleted={classToBeDeleted}
                  showDeleteClassModal={showDeleteClassModal}
                  setShowDeleteClassModal={setShowDeleteClassModal}
                  setClassIsDeleted={setClassIsDeleted}
               />
            )}
            {showNewClassModal === true && (
               <NewClassModal
                  categorias={categorias}
                  materias={materias}
                  teachers={teachers}
                  setNewClassConfirmed={setNewClassConfirmed}
                  setShowNewClassModal={setShowNewClassModal}
               />
            )}
         </div>
      </>
   );
};

export default ClassesTable;
