import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

type Datos = {
   activos: number;
   eliminados: number;
   total: number;
};

const Stats = () => {
   const [datos, setDatos] = useState<Datos>();
   const [grafico, setGrafico] = useState('');

   useEffect(() => {
      axiosInstance
         .get('/users/stats/image', { responseType: 'blob' })
         .then((res) => {
            const url = URL.createObjectURL(res.data);
            setGrafico(url);
         })
         .catch((err) => {
            console.log(err);
         });

      axiosInstance.get('/users/stats').then((res) => {
         console.log(res.data);
         setDatos(res.data);
      });
   }, []);

   return (
      <div className="w-full p-4 rounded-2xl">
         <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Estadísticas de Usuarios
         </h2>
         <hr className="border-2 border-black mb-6" />

         {/* Tarjetas con datos */}
         {datos && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
               <div className="flex-1 bg-blue-100 text-blue-800 p-4 rounded-xl text-center shadow">
                  <h3 className="text-lg font-semibold">Activos</h3>
                  <p className="text-2xl font-bold">{datos.activos}</p>
               </div>
               <div className="flex-1 bg-red-100 text-red-800 p-4 rounded-xl text-center shadow">
                  <h3 className="text-lg font-semibold">Eliminados</h3>
                  <p className="text-2xl font-bold">{datos.eliminados}</p>
               </div>
               <div className="flex-1 bg-gray-100 text-gray-800 p-4 rounded-xl text-center shadow">
                  <h3 className="text-lg font-semibold">Total</h3>
                  <p className="text-2xl font-bold">{datos.total}</p>
               </div>
            </div>
         )}

         {/* Imagen del gráfico */}
         {grafico ? (
            <div className="flex justify-center">
               <img
                  src={grafico}
                  alt="Gráfico de estadísticas"
                  className="max-w-full h-auto rounded-lg border border-gray-200 shadow-md"
               />
            </div>
         ) : (
            <p className="text-center text-gray-500">Cargando gráfico...</p>
         )}
      </div>
   );
};

export default Stats;
