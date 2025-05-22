import React, { useState } from 'react';

const UnirmeClase: React.FC = () => {
  const [codigo, setCodigo] = useState('');

  const handleUnirme = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Solicitando unirse a la clase con código: ${codigo}`);
    // Aquí hay que llamar a la API para unirse a la clase
    setCodigo('');
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border-4 border-blue-400 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Unirme a una Clase</h2>

        <form onSubmit={handleUnirme} className="flex flex-col space-y-5">
          <input
            type="text"
            placeholder="Código de la clase"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Unirme
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnirmeClase;
