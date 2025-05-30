/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const UnirmeClase: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  
  const studentId = localStorage.getItem('studentId');

  const handleUnirme = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    if (!studentId) {
      setMensaje('❌ No se encontró tu ID de alumno. Inicia sesión nuevamente.');
      setCargando(false);
      return;
    }

    try {
      await axiosInstance.post(
  `/classes/${codigo}/enroll`,
  { studentId },
      );

      setMensaje('✅ Te uniste correctamente a la clase.');
    } catch (error: any) {
      if (error.response?.status === 404) {
        setMensaje('❌ Clase no encontrada. Verifica el código.');
      } else if (error.response?.status === 400) {
        setMensaje('❌ Ya estás unido a esta clase.');
      } else {
        setMensaje('❌ Error al intentar unirse a la clase.');
      }
    } finally {
      setCargando(false);
      setCodigo('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Unirme a una Clase</h2>
      <form onSubmit={handleUnirme} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Código de la clase"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {cargando ? 'Uniéndote...' : 'Unirme'}
        </button>
        {mensaje && <p className="text-sm text-center mt-2">{mensaje}</p>}
      </form>
    </div>
  );
};

export default UnirmeClase;
