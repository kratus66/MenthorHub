import React, { useState } from 'react';
import { BookOpenText, FileText, Paperclip } from 'lucide-react';

const CrearClase: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [clases, setClases] = useState<
    { titulo: string; descripcion: string; archivos: File[] }[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivos(Array.from(e.target.files));
    }
  };

  const handleCrear = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevaClase = {
      titulo,
      descripcion,
      archivos,
    };

    setClases(prev => [nuevaClase, ...prev]); // Agrega la nueva clase al principio
    setTitulo('');
    setDescripcion('');
    setArchivos([]);
  };

  return (
    <div className="bg-blue-500 min-h-screen p-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Crear Clase</h2>
        <form onSubmit={handleCrear} className="space-y-4">
          <div className="relative">
            <BookOpenText className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Título de la clase"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" />
            <textarea
              placeholder="Descripción de la clase"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              className="pl-10 pt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div className="relative">
            <Paperclip className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 file:cursor-pointer file:mr-4"
            />
          </div>

          {archivos.length > 0 && (
            <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700">
              <p className="font-medium mb-1">Archivos seleccionados:</p>
              <ul className="list-disc list-inside space-y-1">
                {archivos.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Publicar
          </button>
        </form>
      </div>

      {/* Mostrar clases creadas */}
      <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
        {clases.map((clase, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4">
            <h3 className="text-xl font-semibold text-blue-700">{clase.titulo}</h3>
            <p className="text-gray-700 mb-2">{clase.descripcion}</p>
            {clase.archivos.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600">
                {clase.archivos.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrearClase;
