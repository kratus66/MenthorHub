import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import type { clasesType } from '../../types/ClassType';
import Chatbot from '../../components/Chatbot/Chatbot';
import NewReviewForm from '../../components/NewReviewForm/NewReviewForm';
import RatingPromedio from '../../components/RatingPromedio/RatingPromedio';
import type { Review } from '../../interfaces/Review';
import ReviewCard from '../../components/ReviewCard/ReviewCard';

// Define a type for submission objects based on usage
interface SubmissionType {
  id: string; // Assuming submissions have their own ID
  task: {
    id: string;
  };
  createdAt: string; // Mapea a createdAt en el backend
  content: string; // Usamos content para la URL del archivo
  grade?: number | null; // Add grade field, optional and can be null initially
  student: { // Assuming student info is included in the submission for the teacher view
    id: string;
    name: string; // Or whatever student identifier is available
  };
}

// Define fetchSubmissions outside the component
async function fetchSubmissions(
  user: { id: string; role: string; name: string } | null,
  selectedTask: any,
  setLoadingSubmissions: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmissions: React.Dispatch<React.SetStateAction<SubmissionType[]>>,
  setTeacherSubmissions: React.Dispatch<React.SetStateAction<SubmissionType[]>>
) {
  try {
    setLoadingSubmissions(true);
    if (user?.role === 'student') {
      // Fetch student's own submissions
      const response = await axiosInstance.get(`/submissions/my-submissions`);
      setSubmissions(response.data as SubmissionType[]);
    } else if (user?.role === 'teacher' && selectedTask) {
      // Fetch all submissions for the selected task
      const response = await axiosInstance.get(`/submissions/task/${selectedTask.id}`);
      setTeacherSubmissions(response.data as SubmissionType[]);
    }
  } catch (error) {
    console.error('Error al cargar entregas:', error);
    if (user?.role === 'student') {
      setSubmissions([]);
    } else if (user?.role === 'teacher') {
      setTeacherSubmissions([]);
    }
  } finally {
    setLoadingSubmissions(false);
  }
}

// Helper function to determine media type and icon
const getMediaInfo = (mediaItem: any) => {
  const url = typeof mediaItem === 'string' ? mediaItem : mediaItem.url;
  let type = typeof mediaItem === 'string' ? '' : mediaItem.type || '';
  let icon = '🔗'; // Default icon for a general link

  if (!type && url) {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      type = 'image';
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      type = 'video';
    } else if (extension === 'pdf') {
      type = 'pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      type = 'document';
    } else if (['zip', 'rar', 'tar', 'gz'].includes(extension)) {
      type = 'archive';
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      type = 'audio';
    }
  }

  switch (type) {
    case 'image':
      icon = '🖼️'; // Placeholder for image icon
      break;
    case 'video':
      icon = '🎞️'; // Placeholder for video icon
      break;
    case 'pdf':
      icon = '📄'; // Placeholder for PDF icon
      break;
    case 'document':
      icon = '📝'; // Placeholder for document icon
      break;
    case 'archive':
      icon = '📦'; // Placeholder for archive icon
      break;
    case 'audio':
      icon = '🎵'; // Placeholder for audio icon
      break;
  }
  
  // Extract filename from URL
  let filename = 'Enlace multimedia';
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    filename = pathSegments.pop() || filename;
    // Decode URI component for better readability if filename is encoded
    filename = decodeURIComponent(filename);
  } catch (e) {
    // If URL is not valid or relative, try a simpler split
    const pathSegments = url.split('/');
    const potentialFilename = pathSegments.pop();
    if (potentialFilename && potentialFilename.includes('.')) { // Basic check for an extension
         filename = decodeURIComponent(potentialFilename);
    }
  }

  return { url, type, icon, filename };
};


const CursoDetalle = () => {
   const { id } = useParams<{ id: string }>();
   // Assert id is string as component likely won't render without it
   const classId = id as string;

   const [curso, setCurso] = useState<clasesType>();
   const [tareas, setTareas] = useState<any[]>([]);
   // Use the defined SubmissionType for the submissions state (student's own submissions)
   const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
   // New state for teacher to view all submissions for a task
   const [teacherSubmissions, setTeacherSubmissions] = useState<SubmissionType[]>([]);
   const [loadingSubmissions, setLoadingSubmissions] = useState(false); // Estado de carga para ambas vistas

   const [activeTab, setActiveTab] = useState('general');
   const [user, setUser] = useState<{
      id: string;
      role: string;
      name: string;
   } | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false); // para crear tarea (profesor)
   const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false); // para ver detalle tarea (estudiante/profesor)
   const [selectedTask, setSelectedTask] = useState<any>(null);
   const [submissionFile, setSubmissionFile] = useState<File | null>(null);
   const [submissionLoading, setSubmissionLoading] = useState(false);
   const [gradingLoading, setGradingLoading] = useState(false); // New state for grading loading

   const [reviews, setReviews] = useState<Review[]>([]);
   const [reviewSent, setReviewSent] = useState(false);

   const [title, setTitle] = useState('');
   const [instructions, setInstructions] = useState('');
   const [deliveryDate, setDeliveryDate] = useState('');
   const [deliveryTime, setDeliveryTime] = useState('');
   const [loadingEnroll, setLoadingEnroll] = useState(false);

   const tabs = [
      { id: 'general', label: 'General' },
      { id: 'multimedia', label: 'Multimedia' },
      { id: 'tareas', label: 'Tareas' },
      { id: 'profesor', label: 'Profesor' },
      { id: 'reviews', label: 'Reviews' },
   ];

   // Effect to load submissions when the task detail modal opens
   useEffect(() => {
      if (user && classId && taskDetailModalOpen && selectedTask) {
        fetchSubmissions(user, selectedTask, setLoadingSubmissions, setSubmissions, setTeacherSubmissions);
      } else if (!taskDetailModalOpen) {
        setSubmissions([]);
        setTeacherSubmissions([]);
      }
    }, [classId, user, taskDetailModalOpen, selectedTask]);


   const [minDate, setMinDate] = useState('');
   const [minTime, setMinTime] = useState('');

   useEffect(() => {
      if (isModalOpen) {
         const now = new Date();
         const isoDate = now.toISOString().split('T')[0];
         const time = `${String(now.getHours()).padStart(2, '0')}:00`;
         setMinDate(isoDate);
         setMinTime(time);
      }
   }, [isModalOpen]);

   useEffect(() => {
      axiosInstance.get(`classes/${classId}`).then((res) => {
         setCurso(res.data);
         setReviews(res.data.reviews);
      });

      axiosInstance.get(`/tasks/class/${classId}`).then((res) => {
         setTareas(res.data);
      });

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
         const parsedUser = JSON.parse(storedUser);
         setUser(parsedUser);
      }
   }, [classId, reviewSent]);


   const userIsStudent = user?.role === 'student';
   const userIsEnrolled = curso?.students?.some((student: { id: string }) => student.id === user?.id);

   const filteredTabs = tabs.filter(tab => {
      if (tab.id === 'tareas' && userIsStudent && !userIsEnrolled) {
         return false;
      }
      return true;
   });

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
         classId: classId,
         teacherId,
      };

      try {
         await axiosInstance.post('/tasks', newTask);
         alert('Tarea creada exitosamente');
         setIsModalOpen(false);
         const res = await axiosInstance.get(`/tasks/class/${classId}`);
         setTareas(res.data);
      } catch (error) {
         console.error('Error al crear tarea:', error);
         alert('Hubo un error al crear la tarea');
      }
   };

   const handleEnroll = async () => {
      if (!user) {
         alert('Debes iniciar sesión para inscribirte');
         return;
      }
      setLoadingEnroll(true);
      try {
         await axiosInstance.post(`/classes/${classId}/enroll`, {
            studentId: user.id,
         });
         alert('Inscripción realizada con éxito');
         const updatedCourse = await axiosInstance.get(`classes/${classId}`);
         setCurso(updatedCourse.data);
      } catch (error) {
         console.error('Error al inscribirse:', error);
         alert('Hubo un error al inscribirse en la clase');
      } finally {
         setLoadingEnroll(false);
      }
   };

   const handleTaskClick = (task: any) => {
      setSelectedTask(task);
      setTaskDetailModalOpen(true);
   };

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
        const formData = new FormData();
        formData.append('file', submissionFile);
        formData.append('taskId', selectedTask.id);
        formData.append('classId', classId);
        formData.append('studentId', user.id);

        const response = await axiosInstance.post('/submissions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmissions(prev => [...prev, response.data as SubmissionType]);
        alert('Entrega realizada con éxito');
        setTaskDetailModalOpen(false);
        setSubmissionFile(null);
      } catch (error) {
        console.error('Error al enviar la entrega:', error);
        alert('Error al enviar la entrega');
      } finally {
        setSubmissionLoading(false);
      }
    };

    const handleGradeChange = (submissionId: string, value: string) => {
      const grade = value === '' ? null : Number(value);
      setTeacherSubmissions(prevSubmissions =>
        prevSubmissions.map(sub =>
          sub.id === submissionId ? { ...sub, grade: grade } : sub
        )
      );
    };

    const handleSaveGrades = async () => {
      setGradingLoading(true);
      try {
        await axiosInstance.put(`/submissions/task/${selectedTask.id}/grades`, {
          submissions: teacherSubmissions.map(sub => ({
            id: sub.id,
            grade: sub.grade,
          })),
        });
        alert('Calificaciones guardadas exitosamente');
        await fetchSubmissions(user, selectedTask, setLoadingSubmissions, setSubmissions, setTeacherSubmissions);
      } catch (error) {
        console.error('Error al guardar calificaciones:', error);
        alert('Hubo un error al guardar las calificaciones');
      } finally {
        setGradingLoading(false);
      }
    };

   if (!curso || !user) {
      return <div className="p-4">Cargando datos...</div>;
   }

   const foundSubmission = submissions.find(sub =>
     String(sub.task?.id) === String(selectedTask?.id)
   );

   const now = new Date();
   const dueDate = selectedTask ? new Date(selectedTask.dueDate) : null;
   const isPastDue = dueDate ? now > dueDate : false;

   const promedioRating =
      curso.reviews.length > 0
         ? curso.reviews.reduce((acc, review) => acc + review.rating, 0) /
           curso.reviews.length
         : 0;

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
         <div className="max-w-6xl w-full h-screen bg-gray-100 shadow-lg rounded-lg p-8 px-0 m-4 lg:m-0 flex flex-col gap-6">
            <div className="w-full flex flex-col items-center">
               <h2 className="text-4xl font-bold text-gray-900 underline">{curso.title}</h2>
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

               {classId && <RatingPromedio promedio={promedioRating} />}

               {userIsStudent && !userIsEnrolled && (
                 <button
                    className="mt-2 w-1/6 bg-blue-400 text-white py-2 rounded-lg font-semibold text-md disabled:opacity-50"
                    onClick={handleEnroll}
                    disabled={loadingEnroll}
                 >
                 {loadingEnroll ? 'Inscribiendo...' : 'Inscribirme'}
                 </button>
               )}

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
               <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                     <h2 className="text-xl font-bold mb-4">Crear nueva tarea</h2>
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
                           min={minDate}
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
                           <option value="" disabled>Selecciona la hora</option>
                           {[...Array(24)].map((_, hour) => {
                              const hourStr = `${String(hour).padStart(2, '0')}:00`;
                              const isToday = deliveryDate === minDate;
                              const shouldDisable = isToday && hour < parseInt(minTime.slice(0, 2));
                              return (
                                 <option
                                    key={hour}
                                    value={hourStr}
                                    disabled={shouldDisable}
                                 >
                                    {hourStr}
                                 </option>
                              );
                           })}
                        </select>
                        <label className="block mb-2 flex items-center">
                           <input type="checkbox" className="mr-2" checked={true} disabled />
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
                           <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white">
                              Crear tarea
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )}

            {taskDetailModalOpen && selectedTask && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                    onClick={() => setTaskDetailModalOpen(false)}
                  >
                    &times;
                  </button>
                  <h3 className="text-2xl font-bold mb-4">{selectedTask.title}</h3>
                  <p className="text-gray-700 mb-4">{selectedTask.instructions}</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Fecha de entrega: {new Date(selectedTask.dueDate).toLocaleDateString()} {new Date(selectedTask.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {loadingSubmissions ? (
                    <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200 text-blue-600 font-semibold">
                      Cargando entregas...
                    </div>
                  ) : (
                    <>
                      {user?.role === 'student' ? (
                        foundSubmission ? (
                          <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
                            <p className="text-green-600 font-semibold">✅ Entrega realizada</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Archivo: <a href={foundSubmission.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{foundSubmission.content}</a>
                            </p>
                            <p className="text-sm text-gray-600">
                              Fecha de subida: {new Date(foundSubmission.createdAt).toLocaleString()}
                            </p>
                               {foundSubmission.grade !== undefined && foundSubmission.grade !== null && (
                                 <p className="text-sm text-gray-800 font-semibold mt-2">
                                   Calificación: {foundSubmission.grade}
                                 </p>
                               )}
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitTask} className="flex flex-col gap-4">
                            <label className="block">
                              <span className="text-gray-700">Adjuntar archivo de entrega:</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt,.zip"
                                onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                                className="mt-1 block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                                required
                                disabled={isPastDue}
                              />
                            </label>
                            {isPastDue && (
                               <p className="text-red-600 text-sm font-semibold">El plazo de entrega ha finalizado.</p>
                            )}
                            <button
                              type="submit"
                              disabled={submissionLoading || isPastDue}
                              className={`bg-blue-600 text-white px-4 py-2 rounded ${
                                submissionLoading || isPastDue ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                              }`}
                            >
                              {submissionLoading ? 'Enviando...' : (isPastDue ? 'Plazo finalizado' : 'Enviar entrega')}
                            </button>
                          </form>
                        )
                      ) : (
                        user?.role === 'teacher' && (
                          <div className="mt-4">
                            <h4 className="text-xl font-semibold mb-3">Entregas de estudiantes:</h4>
                            {teacherSubmissions.length === 0 ? (
                              <p className="text-gray-600">Aún no hay entregas para esta tarea.</p>
                            ) : (
                              <ul className="space-y-4">
                                {teacherSubmissions.map(submission => (
                                  <li key={submission.id} className="border border-gray-300 rounded-md p-4 bg-gray-50">
                                    <p className="font-semibold text-gray-800">Estudiante: {submission.student.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Archivo: <a href={submission.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.content}</a>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Fecha de subida: {new Date(submission.createdAt).toLocaleString()}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                      <label htmlFor={`grade-${submission.id}`} className="text-gray-700">Calificación:</label>
                                      <input
                                        id={`grade-${submission.id}`}
                                        type="number"
                                        min="1"
                                        max="10"
                                        step="0.1"
                                        value={submission.grade ?? ''}
                                        onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                                        className="border border-gray-300 p-1 rounded w-20 text-center"
                                      />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                             {teacherSubmissions.length > 0 && (
                               <button
                                 onClick={handleSaveGrades}
                                 disabled={gradingLoading}
                                 className={`mt-6 bg-green-600 text-white px-4 py-2 rounded w-full ${
                                   gradingLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                                 }`}
                               >
                                 {gradingLoading ? 'Guardando...' : 'Guardar Calificaciones'}
                               </button>
                             )}
                          </div>
                        )
                      )}
                    </>
                  )}
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
                           activeTab === tab.id ? 'border-blue-700 text-blue-700' : ''
                        }`}
                     >
                        {tab.label}
                     </button>
                  ))}
               </nav>

               {activeTab === 'general' && (
                  <section className="p-4">
                     <h3 className="text-xl font-semibold mb-4">Descripción</h3>
                     <p className="text-gray-800 mb-4">{curso.description}</p>
                  </section>
               )}

               {activeTab === 'multimedia' && (
                  <section className="p-4">
                     <h3 className="text-xl font-semibold mb-4">Contenido Multimedia</h3>
                     {curso.multimedia && curso.multimedia.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {curso.multimedia.map((mediaItem, index) => {
                              const { url, icon, filename } = getMediaInfo(mediaItem);
                              return (
                                 <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg shadow hover:shadow-md transition-shadow bg-white hover:bg-gray-50 text-center"
                                    title={`Abrir ${filename}`}
                                 >
                                    <span className="text-4xl mb-2">{icon}</span>
                                    <span className="text-sm text-gray-700 truncate w-full px-1">{filename}</span>
                                 </a>
                              );
                           })}
                        </div>
                     ) : (
                        <p className="text-center text-gray-600">No hay contenido multimedia disponible para esta clase.</p>
                     )}
                  </section>
               )}

               {activeTab === 'tareas' && (
                  <section className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                     {tareas.length === 0 ? (
                        <p className="text-center text-gray-600 col-span-full">No hay tareas asignadas para esta clase.</p>
                     ) : (
                        tareas.map((task) => (
                           <div
                              key={task.id}
                              className="cursor-pointer rounded-md border border-gray-300 bg-white shadow p-4 hover:shadow-lg transition"
                              onClick={() => handleTaskClick(task)}
                           >
                              <h4 className="text-lg font-semibold">{task.title}</h4>
                              <p className="text-gray-600 text-sm line-clamp-3">{task.instructions}</p>
                              <p className="mt-2 text-gray-500 text-xs">
                                 Entrega: {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  <div className="w-full h-full flex gap-4">
                     <div className="flex flex-col w-1/2 gap-2 overflow-y-auto">
                        {reviews.map((review) => {
                           return (
                              <div key={review.id}>
                                 <ReviewCard review={review} />
                              </div>
                           );
                        })}
                     </div>
                     <div className="w-1/2 bg-gray-200 me-6 rounded-md p-4">
                        {userIsStudent && userIsEnrolled && (
                           <NewReviewForm
                              targetStudentId={user.id}
                              courseId={curso.id}
                              setReviewSent={setReviewSent}
                           />
                        )}
                        {(!userIsStudent || !userIsEnrolled) && (
                           <p className="text-center text-gray-600">
                              Debes ser un estudiante inscrito para dejar una reseña.
                           </p>
                        )}
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
