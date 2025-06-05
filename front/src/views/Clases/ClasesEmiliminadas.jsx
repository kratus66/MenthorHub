import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useUser } from '../../context/UserContext';

const ClasesEliminadas = () => {
  const { user } = useUser();
  const [clases, setClases] = useState([]);

  useEffect(() => {
    axiosInstance.get('/classes/deleted')
      .then(res => setClases(res.data))
      .catch(err => console.error('❌ Error al cargar clases eliminadas:', err));
  }, []);

  const restaurarClase = (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres restaurar esta clase?');
    if (!confirmar) return;

    axiosInstance.put(`/classes/${id}/restore`)
      .then(() => {
        alert('✅ Clase restaurada');
        setClases(clases.filter(clase => clase.id !== id));
      })
      .catch(err => {
        console.error('❌ Error al restaurar clase:', err);
        alert('No se pudo restaurar la clase');
      });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Clases Eliminadas</h2>
      {clases.length === 0 ? (
        <p>No tienes clases eliminadas.</p>
      ) : (
        <ul>
          {clases.map(clase => (
            <li key={clase.id} className="mb-3 p-4 border rounded">
              <strong>{clase.title}</strong> - {clase.description}
              <button
                className="ml-4 px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => restaurarClase(clase.id)}
              >
                Restaurar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClasesEliminadas;
