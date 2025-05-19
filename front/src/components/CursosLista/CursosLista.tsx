import sampleClasses from '../../helpers/fakeClasses';

const CursosLista = () => {
   return (
      <>
         <div className="h-auto min-h-[20rem] flex flex-col gap-2">
            <h2 className="text-4xl mb-1">Cursos:</h2>
            {sampleClasses.map((curso, index) => {
               return (
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
                           <h3>Categoría: {curso.category.name}</h3>
                        </div>
                     </div>
                  </a>
               );
            })}
         </div>
      </>
   );
};

export default CursosLista;
