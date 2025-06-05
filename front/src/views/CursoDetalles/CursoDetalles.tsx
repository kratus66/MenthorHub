import MateriasScroll from '../../components/MateriasScroll/MateriasScroll';
import CategoriaScroll from '../../components/CategoriaScroll/CategoriaScroll';
import CursosLista from '../../components/CursosLista/CursosLista';
import { useEffect, useState } from 'react';
import type { CategoryType } from '../../types/CategoryType';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../../components/Chatbot/Chatbot';

type DashboardProps = {
   filtros: {
      search?: string;
      category?: string;
      teacherId?: string;
      materia?: string;
   };
   setFiltros: React.Dispatch<
      React.SetStateAction<{
         search?: string;
         category?: string;
         teacherId?: string;
         materia?: string;
      }>
   >;
};

const Dashboard = ({ filtros, setFiltros }: DashboardProps) => {
   const [categoriasIniciales, setCategoriasIniciales] = useState<CategoryType[]>([]);
   const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
   const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
   const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
   const [materiasVisibles, setMateriasVisibles] = useState<{ id: string; name: string }[]>([]);

   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/login');
      }
   }, [navigate]);

   useEffect(() => {
      setFiltros((prev) => ({
         ...prev,
         ...(categoriaSeleccionada && { category: categoriaSeleccionada }),
         search: undefined,
      }));
   }, [categoriaSeleccionada, materiaSeleccionada, setFiltros]);

   useEffect(() => {
      if (categoriasIniciales.length > 0 && categoriasIniciales[0].materias) {
         setMateriasVisibles(categoriasIniciales[0].materias);
      }
   }, [categoriasIniciales]);

   return (
      <div className="w-full h-[calc(100vh-68px)] flex flex-col lg:flex-row bg-[#f9fafb] relative">
         {/* Contenido principal */}
         <div className="w-full lg:w-[75%] h-full overflow-y-auto px-4 py-4 flex flex-col gap-6">
            <CategoriaScroll
               onCategoriaSeleccionada={setCategoriaSeleccionada}
               onMateriaSeleccionada={setMateriaSeleccionada}
               onCategoriaActiva={setCategoriaActiva}
               setMateriasVisibles={setMateriasVisibles}
               setCategoriasIniciales={setCategoriasIniciales}
               categoriaActiva={categoriaActiva || undefined}
            />
            <MateriasScroll
               materias={materiasVisibles}
               onMateriaSeleccionada={setMateriaSeleccionada}
               materiaSeleccionada={materiaSeleccionada}
            />
            <CursosLista
               onCategoriaSeleccionada={setCategoriaSeleccionada}
               onMateriaSeleccionada={setMateriaSeleccionada}
               onCategoriaActiva={setCategoriaActiva}
               filtros={filtros}
               setFiltros={setFiltros}
            />
         </div>

         {/* Chatbot: visible solo en pantallas grandes */}
         <div className="hidden lg:block lg:w-[25%] h-full p-4">
            <div className="h-full w-full bg-[#f3f4f6] rounded-xl overflow-hidden">
               <Chatbot />
            </div>
         </div>

         {/* Chatbot en mobile: flotante abajo a la derecha */}
         <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Chatbot />
         </div>
      </div>
   );
};

export default Dashboard;
