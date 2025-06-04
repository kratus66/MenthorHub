/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import { Check, Camera } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import axiosInstance from '../../services/axiosInstance';
import type { User } from '../../interfaces/User';
import Chatbot from '../../components/Chatbot/Chatbot';

const UserProfile: React.FC = () => {
   const { user, setUser } = useUser();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [isModified, setIsModified] = useState(false);
   const [showSavedMsg, setShowSavedMsg] = useState(false);
   const userDataFromStorage = localStorage.getItem('user');
   let userDataParsed: User;
   if (userDataFromStorage) {
      userDataParsed = JSON.parse(userDataFromStorage);
   }

   useEffect(() => {
      axiosInstance
         .get(`/users/${userDataParsed.id}`)
         .then((res) => {
            setUser(res.data);
         })
         .catch((err) => {
            console.log('Error al traer la data del usuario:', err);
         });
   }, []);

   useEffect(() => {
      setIsModified(true);
   }, [user]);

   const handleChangePhotoClick = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const imageUrl = URL.createObjectURL(file);
         setUser((prev) => ({ ...prev, profileImage: imageUrl }));
      }
   };

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setUser((prev) => ({ ...prev, [name]: value }));
   };

   const handleSave = () => {
      if (!user) return; // seguridad adicional

      axiosInstance
         .put(`/users/${user.id}`, user)
         .then(() => {
            setShowSavedMsg(true);
            setTimeout(() => setShowSavedMsg(false), 3000);
            setIsModified(false); // marcamos que ya se guardó
         })
         .catch((err) => {
            console.error('Error al guardar cambios:', err);
            // Podés mostrar un mensaje de error si querés
         });
   };

   if (!user) {
      return <p>Cargando usuario...</p>;
   }

   console.log('Datos de Usuario', user);

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 px-6 py-12">
         <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-center text-white">
               Hola, <span className="text-blue-300">{user.name}</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-8 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl">
               <div className="md:w-1/3 space-y-6">
                  <div className="flex justify-center">
                     <div className="relative group">
                        <img
                           src={
                              user?.profileImage ??
                              'https://i.pravatar.cc/150?img=3'
                           }
                           className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg group-hover:scale-105 transition"
                           alt="Foto de perfil"
                        />
                        <button
                           onClick={handleChangePhotoClick}
                           className="absolute bottom-2 right-2 bg-white text-blue-900 p-2 rounded-full shadow hover:bg-gray-200 transition"
                           title="Cambiar foto"
                        >
                           <Camera size={18} />
                        </button>
                        <input
                           type="file"
                           ref={fileInputRef}
                           accept="image/*"
                           onChange={handleFileChange}
                           className="hidden"
                        />
                     </div>
                  </div>

                  <div>
                     <h2 className="text-xl font-semibold mb-2 text-white">
                        Descripción Personal
                     </h2>
                     <textarea
                        name="description"
                        value={user.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full p-3 rounded-md border border-blue-300 text-black focus:ring-2 focus:ring-blue-500 resize-none transition"
                        placeholder="Contanos algo sobre vos"
                     />
                  </div>

                 {user && (
   <div className="mt-4">
      <span className="text-lg font-medium mr-3 text-white">
         Suscripción:
      </span>
      <span
         className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
            user.isPaid
               ? 'bg-green-500 text-white'
               : 'bg-red-500 text-white'
         }`}
      >
         {user.isPaid ? 'activa' : 'inactiva'}
      </span>
   </div>
)}

               </div>

               <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                     { label: 'Nombre', name: 'name', value: user.name },
                     {
                        label: 'Teléfono',
                        name: 'phoneNumber',
                        value: user.phoneNumber,
                     },
                     { label: 'Correo', name: 'email', value: user.email },
                     { label: 'País', name: 'country', value: user.country },
                     {
                        label: 'Provincia',
                        name: 'provincia',
                        value: user.provincia,
                     },
                     {
                        label: 'Localidad',
                        name: 'localidad',
                        value: user.localidad,
                     },
                  ].map((field) => (
                     <input
                        key={field.name}
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        placeholder={field.label}
                        className="p-3 rounded border border-blue-300 text-black focus:ring-2 focus:ring-blue-500 transition"
                     />
                  ))}

                  <input
                     value={user.role}
                     disabled
                     className="p-3 border border-gray-300 rounded bg-gray-100 text-gray-600 col-span-1"
                  />
                  {user && user.role?.toLowerCase() === 'student' && (
                     <input
                        value={user.estudios}
                        disabled
                        className="p-3 border border-gray-300 rounded bg-gray-100 text-gray-600 col-span-1"
                     />
                  )}
               </div>
            </div>

            <div className="text-center mt-8">
               <button
                  onClick={handleSave}
                  disabled={!isModified}
                  className={`px-8 py-3 rounded-md font-semibold transition duration-300 ${
                     isModified
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
               >
                  Guardar Cambios
               </button>

               {showSavedMsg && (
                  <p className="mt-4 text-green-200 animate-pulse text-sm">
                     <Check className="inline mr-1" /> Cambios guardados
                     correctamente
                  </p>
               )}
            </div>
         </div>
         <Chatbot />
      </div>
   );
};

export default UserProfile;
