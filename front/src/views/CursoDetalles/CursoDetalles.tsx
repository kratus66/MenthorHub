import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import type { clasesType } from '../../types/ClassType';
import Chatbot from '../../components/Chatbot/Chatbot';
import RatingEstrellas from '../../components/RatingEstrellas/RatingEstrellas';
import NewReviewForm from '../../components/NewReviewForm/NewReviewForm';

const CursoDetalle = () => {
   const { id } = useParams<{ id: string }>();
   const [curso, setCurso] = useState<clasesType>();
   const [tareas, setTareas] = useState<any[]>([]);
   const [activeTab, setActiveTab] = useState('general');
   const [user, setUser] = useState<{ id: string; role: string } | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false); // para crear tarea (profesor)
   const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false); // para ver detalle tarea (estudiante)
   const [selectedTask, setSelectedTask] = useState<any>(null);
   const [submissionFile, setSubmissionFile] = useState<File | null>(null);
   const [submissionLoading, setSubmissionLoading] = useState(false);

   const [title, setTitle] = useState('');
   const [instructions, setInstructions] = useState('');
   const [deliveryDate, setDeliveryDate] = useState('');
   const [deliveryTime, setDeliveryTime] = useState('');
   const [loadingEnroll, setLoadingEnroll] = useState(false);

   const tabs = [
      { id: 'general', label: 'General' },
      { id: 'tareas', label: 'Tareas' },
      { id: 'profesor', label: 'Profesor' },
      { id: 'reviews', label: 'Reviews' },
   ];

   useEffect(() => {
      axiosInstance.get(`classes/${id}`).then((res) => {
         setCurso(res.data);
         console.log('Data del curso:', res.data);
      });

      axiosInstance.get(`/tasks/class/${id}`).then((res) => {
         setTareas(res.data);
      });

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
         setUser(JSON.parse(storedUser));
      }
   }, [id]);

   // Determinar si el usuario es estudiante y si está inscrito en la clase
   const userIsStudent = user?.role === 'student';
   const userIsEnrolled = curso?.students?.some(
      (student) => student.id === user?.id
   );

   // Filtrar pestañas para ocultar "Tareas" si el estudiante no está inscrito
   const filteredTabs = tabs.filter((tab) => {
      if (tab.id === 'tareas' && userIsStudent && !userIsEnrolled) {
         return false;
      }
      return true;
   });

   // Crear nueva tarea (profesor)
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const dueDate = `${deliveryDate}T${deliveryTime}:00`;

      const storedUser = localStorage.getItem('user');
      const teacherId = storedUser ? JSON.parse(storedUser).id : null;

      if (!teacherId) {
         alert('Error: No se pudo obtener el ID del profesor.');
         return;
      }

      const newTask = {
         title,
         instructions,
         dueDate,
         estado: true,
         classId: id,
         teacherId,
      };

      try {
         const response = await axiosInstance.post('/tasks', newTask);
         alert('Tarea creada exitosamente');
         setIsModalOpen(false);

         // Refrescar lista de tareas
         const res = await axiosInstance.get(`/tasks/class/${id}`);
         setTareas(res.data);
      } catch (error) {
         console.error('Error al crear tarea:', error);
         alert('Hubo un error al crear la tarea');
      }
   };

   // Inscribirse a clase
   const handleEnroll = async () => {
      if (!user) {
         alert('Debes iniciar sesión para inscribirte');
         return;
      }

      setLoadingEnroll(true);

      try {
         await axiosInstance.post(`/classes/${id}/enroll`, {
            studentId: user.id,
         });

         alert('Inscripción realizada con éxito');

         // Refrescar la info del curso para actualizar lista de estudiantes
         const updatedCourse = await axiosInstance.get(`classes/${id}`);
         setCurso(updatedCourse.data);
      } catch (error) {
         console.error('Error al inscribirse:', error);
         alert('Hubo un error al inscribirse en la clase');
      } finally {
         setLoadingEnroll(false);
      }
   };

   // Abrir modal detalle tarea al clickear tarea
   const handleTaskClick = (task: any) => {
      setSelectedTask(task);
      setTaskDetailModalOpen(true);
   };

   // Enviar entrega (submission) de tarea
   const handleSubmitTask = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user || !selectedTask) {
         alert('Error al enviar la entrega.');
         return;
      }

      if (!submissionFile) {
         alert('Por favor, selecciona un archivo para la entrega.');
         return;
      }

      setSubmissionLoading(true);

      try {
         // Crear FormData para envío con
         const formData = new FormData();
         formData.append('file', submissionFile);
         formData.append('taskId', selectedTask.id);
         formData.append('classId', id);
         formData.append('studentId', user.id);

         // Asumo que el endpoint para entregas es POST /submissions con FormData
         await axiosInstance.post('/submissions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
         });

         alert('Entrega realizada con éxito');
         setTaskDetailModalOpen(false);
         setSubmissionFile(null);

         // Opcional: refrescar lista de tareas o entregas si se requiere
      } catch (error) {
         console.error('Error al enviar la entrega:', error);
         alert('Error al enviar la entrega');
      } finally {
         setSubmissionLoading(false);
      }
   };

   if (!curso || !user) {
      return <div className="p-4">Cargando datos...</div>;
   }

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
         <div className="max-w-6xl w-full h-screen bg-gray-100 shadow-lg rounded-lg p-8 px-0 m-4 lg:m-0 flex flex-col gap-6">
            <div className="w-full flex flex-col items-center">
               <h2 className="text-4xl font-bold text-gray-900 underline">
                  {curso.title}
               </h2>
               <div className="flex mt-2">
                  <p className="text-gray-600 text-lg">
                     <strong>Categoría:</strong> {curso.category.name}
                  </p>
                  <span className="mx-4 text-2xl">|</span>
                  <p className="text-gray-600 text-lg">
                     <strong>Materia:</strong> {curso.materia.name}
                  </p>
               </div>
               <p className="text-gray-600 text-lg">
                  <strong>Profesor:</strong> {curso.teacher.name}
               </p>

               {id && (
                  <RatingEstrellas
                     classId={id}
                     initialAverage={
                        curso.reviews.length
                           ? curso.reviews.reduce(
                                (acc, r) => acc + r.rating,
                                0
                             ) / curso.reviews.length
                           : 0
                     }
                  ></RatingEstrellas>
               )}

               <button
                  className="mt-2 w-1/6 bg-blue-400 text-white py-2 rounded-lg font-semibold text-md disabled:opacity-50"
                  onClick={handleEnroll}
                  disabled={userIsEnrolled || loadingEnroll}
               >
                  {loadingEnroll
                     ? 'Inscribiendo...'
                     : userIsEnrolled
                     ? 'Inscripto'
                     : 'Inscribirme'}
               </button>

               {user.role === 'teacher' && user.id === curso.teacher.id && (
                  <button
                     className="mt-2 w-1/6 bg-green-500 text-white py-2 rounded-lg font-semibold text-md"
                     onClick={() => setIsModalOpen(true)}
                  >
                     Crear tarea +
                  </button>
               )}
            </div>

            {isModalOpen && (
               <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                     <h2 className="text-xl font-bold mb-4">
                        Crear nueva tarea
                     </h2>
                     <form onSubmit={handleSubmit}>
                        <label className="block mb-2">Título:</label>
                        <input
                           type="text"
                           className="border border-gray-300 p-2 w-full rounded mb-4"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           required
                        />

                        <label className="block mb-2">Instrucciones:</label>
                        <textarea
                           className="border border-gray-300 p-2 w-full rounded mb-4"
                           value={instructions}
                           onChange={(e) => setInstructions(e.target.value)}
                           required
                        ></textarea>

                        <label className="block mb-2">Fecha de entrega:</label>
                        <input
                           type="date"
                           className="border border-gray-300 p-2 w-full rounded mb-4"
                           value={deliveryDate}
                           onChange={(e) => setDeliveryDate(e.target.value)}
                           required
                        />

                        <label className="block mb-2">Hora de entrega:</label>
                        <select
                           className="border border-gray-300 p-2 w-full rounded mb-4"
                           value={deliveryTime}
                           onChange={(e) => setDeliveryTime(e.target.value)}
                           required
                        >
                           <option value="" disabled>
                              Selecciona la hora
                           </option>
                           {[...Array(24)].map((_, hour) => (
                              <option
                                 key={hour}
                                 value={`${String(hour).padStart(2, '0')}:00`}
                              >
                                 {String(hour).padStart(2, '0')}:00
                              </option>
                           ))}
                        </select>

                        <label className="block mb-2 flex items-center">
                           <input
                              type="checkbox"
                              className="mr-2"
                              checked={true}
                              disabled
                           />
                           Activa
                        </label>

                        <div className="flex justify-end gap-4">
                           <button
                              type="button"
                              className="bg-gray-400 px-4 py-2 rounded text-white"
                              onClick={() => setIsModalOpen(false)}
                           >
                              Cancelar
                           </button>
                           <button
                              type="submit"
                              className="bg-blue-500 px-4 py-2 rounded text-white"
                           >
                              Crear tarea
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )}

            {/* Modal detalle tarea para estudiante */}
            {taskDetailModalOpen && selectedTask && (
               <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-2/5 max-w-xl p-6 relative">
                     <button
                        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                        onClick={() => setTaskDetailModalOpen(false)}
                     >
                        ✖
                     </button>
                     <h3 className="text-2xl font-semibold mb-4">
                        {selectedTask.title}
                     </h3>
                     <p className="mb-4 whitespace-pre-wrap">
                        {selectedTask.instructions}
                     </p>
                     <p className="mb-2">
                        <strong>Fecha de entrega:</strong>{' '}
                        {new Date(selectedTask.dueDate).toLocaleString()}
                     </p>

                     <form
                        onSubmit={handleSubmitTask}
                        className="flex flex-col gap-4"
                     >
                        <label>
                           Adjuntar archivo de entrega:
                           <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt,.zip"
                              onChange={(e) => {
                                 if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                 ) {
                                    setSubmissionFile(e.target.files[0]);
                                 }
                              }}
                              className="mt-1"
                           />
                        </label>
                        <button
                           type="submit"
                           disabled={submissionLoading}
                           className={`bg-blue-600 text-white px-4 py-2 rounded ${
                              submissionLoading
                                 ? 'opacity-50 cursor-not-allowed'
                                 : 'hover:bg-blue-700'
                           }`}
                        >
                           {submissionLoading
                              ? 'Enviando...'
                              : 'Enviar entrega'}
                        </button>
                     </form>
                  </div>
               </div>
            )}

            <div className="flex flex-col gap-6 overflow-y-auto">
               <nav className="w-full flex justify-center gap-6 border-b border-gray-400 pb-2">
                  {filteredTabs.map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`border-b-4 border-transparent hover:border-blue-500 font-semibold text-gray-700 ${
                           activeTab === tab.id
                              ? 'border-blue-700 text-blue-700'
                              : ''
                        }`}
                     >
                        {tab.label}
                     </button>
                  ))}
               </nav>

               {activeTab === 'general' && (
                  <section className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                     {/* Imagen representativa de la clase */}
                     <div>
                        <img
                           src={curso.category.imageUrl} // Asegúrate de que `curso.image` contenga la URL correcta
                           alt="Imagen de la clase"
                           className="w-full h-auto rounded-lg shadow-md object-cover"
                        />
                     </div>

                     {/* Contenido descriptivo y multimedia */}
                     <div>
                        <h3 className="text-xl font-semibold mb-4">
                           Descripción
                        </h3>
                        <p className="text-gray-800 mb-4">
                           {curso.description}
                        </p>

                        {/* Aquí podrías incluir un video o enlace a contenido multimedia si lo tienes */}
                        {curso.category.imageUrl && (
                           <div className="mt-4">
                              <h4 className="text-lg font-semibold mb-2">
                                 Contenido Multimedia
                              </h4>
                              <video
                                 src={curso.category.imageUrl}
                                 controls
                                 className="w-full rounded-lg shadow"
                              >
                                 Tu navegador no soporta el elemento de video.
                              </video>
                           </div>
                        )}
                     </div>
                  </section>
               )}

               {activeTab === 'tareas' && (
                  <section className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                     {tareas.length === 0 ? (
                        <p className="text-center text-gray-600 col-span-full">
                           No hay tareas asignadas para esta clase.
                        </p>
                     ) : (
                        tareas.map((task) => (
                           <div
                              key={task.id}
                              className="cursor-pointer rounded-md border border-gray-300 bg-white shadow p-4 hover:shadow-lg transition"
                              onClick={() => handleTaskClick(task)}
                           >
                              <h4 className="text-lg font-semibold">
                                 {task.title}
                              </h4>
                              <p className="text-gray-600 text-sm line-clamp-3">
                                 {task.instructions}
                              </p>
                              <p className="mt-2 text-gray-500 text-xs">
                                 Entrega:{' '}
                                 {new Date(task.dueDate).toLocaleDateString()}{' '}
                                 {new Date(task.dueDate).toLocaleTimeString(
                                    [],
                                    { hour: '2-digit', minute: '2-digit' }
                                 )}
                              </p>
                           </div>
                        ))
                     )}
                  </section>
               )}

               {activeTab === 'profesor' && curso.teacher && (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                     <img
                        src={
                           curso.teacher.profileImage || '/default-avatar.png'
                        }
                        alt={`Foto de ${curso.teacher.name}`}
                        className="w-32 h-32 rounded-full object-cover shadow-md"
                     />
                     <p className="text-gray-700 text-lg font-semibold">
                        Nombre del profesor:
                     </p>
                     <p className="text-gray-900 text-xl font-bold">
                        {curso.teacher.name}
                     </p>
                     <p className="text-gray-700 text-lg font-semibold mt-4">
                        Email de contacto:
                     </p>
                     <p className="text-gray-900 text-xl font-bold">
                        {curso.teacher.email}
                     </p>
                  </div>
               )}

               {activeTab === 'reviews' && (
                  <div className="w-full h-full flex">
                     <div className="flex flex-col"></div>
                     <div className="">
                        <NewReviewForm />
                     </div>
                  </div>
               )}
            </div>

            <Chatbot />
         </div>
      </div>
   );
};

export default CursoDetalle;
