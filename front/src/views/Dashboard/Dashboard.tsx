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
   const [categoriasIniciales, setCategoriasIniciales] = useState<
      CategoryType[]
   >([]);
   const [categoriaSeleccionada, setCategoriaSeleccionada] =
      useState<string>('');
   const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
   const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
   const [materiasVisibles, setMateriasVisibles] = useState<
      { id: string; name: string }[]
   >([]);

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
   }, [categoriaSeleccionada, setFiltros]);

   useEffect(() => {
      if (categoriasIniciales.length > 0 && categoriasIniciales[0].materias) {
         setMateriasVisibles(categoriasIniciales[0].materias);
      }
   }, [categoriasIniciales]);

   return (
      <>
         <div className="w-full h-[calc(100vh-68px)] flex bg-[#f9fafb] relative">
            <div className="h-[calc(100% - 68px)] w-3/4 m-4 flex flex-col gap-6 overflow-y-scroll ps-5">
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
            <div className="h-[calc(100% - 68px)] w-1/4 m-4 bg-[#f3f4f6] rounded-xl">
               <h2></h2>
            </div>
            <Chatbot />
         </div>
      </>
   );
};

export default Dashboard;
