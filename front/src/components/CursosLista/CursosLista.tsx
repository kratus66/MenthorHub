import sampleClasses from '../../helpers/fakeClasses';

type CategoriaType = {
   categoria: string;
};

const CursosLista = ({ categoria }: CategoriaType) => {
   const cursosFiltrados = categoria
      ? sampleClasses.filter((curso) => curso.category.nombre === categoria)
      : sampleClasses;

   console.log(categoria);
   console.log(cursosFiltrados[0]);

   return (
      <>
         <div className="h-auto min-h-[20rem] flex flex-col gap-2">
            <h2 className="text-4xl mb-1">Cursos:</h2>
            <div className="p-3 bg-[#f3f4f6] flex flex-col gap-2">
               <div className="flex justify-end">
                  <button className="bg-blue-400 text-white p-3">
                     Limpiar Filtros
                  </button>
               </div>
               {cursosFiltrados.map((curso, index) => (
                  <a href="#" key={index}>
                     <div className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 hover:cursor-pointer transition-colors flex justify-between">
                        <div>
                           <h3 className="text-xl font-semibold text-blue-400">
                              {curso.title}
                           </h3>
                           <p className="text-gray-600">
                              Profesor: {curso.teacher.name}
                           </p>
                        </div>
                        <div>
                           <h3>Categoría: {curso.category.nombre}</h3>
                        </div>
                     </div>
                  </a>
               ))}
            </div>
         </div>
      </>
   );
};

export default CursosLista;
