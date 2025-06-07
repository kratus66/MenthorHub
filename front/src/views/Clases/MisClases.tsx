// front/src/views/Clases/MisClases.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import type { clasesType } from "../../types/ClassType";
import { useUser } from "../../context/UserContext"; // Asegúrate de importar esto

export default function MisClases() {
  const [clases, setClases] = useState<clasesType[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const { user } = useUser(); // Obtén el usuario del contexto
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!user?.id) return;

    console.log("🔍 Obteniendo clases solo del profesor");
    axiosInstance
      .get(`/classes/teacher/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("📦 Clases del profesor:", res.data);
        setClases(res.data.data); // ← usa .data si lo devolviste paginado
      })
      .catch((err) => {
        console.error("❌ Error al traer clases:", err);
        alert("Error al cargar las clases del profesor.");
      })
      .finally(() => setCargando(false));
  }, [user?.id, token]);

  const handleSoftDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta clase?")) return;

    console.log("🗑️ Intentando borrado lógico de clase ID:", id);
    try {
      const res = await axiosInstance.delete<{ message: string }>(
        `/classes/${id}/soft`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        "✅ Respuesta DELETE /classes/:id/soft:",
        res.status,
        res.data
      );
      setClases((prev) => prev.filter((clase) => clase.id !== id));
      alert(res.data.message || "Clase eliminada correctamente.");
    } catch (err: any) {
      console.error("❌ Error al eliminar clase:", err);
      if (err.response?.status === 403) {
        alert(err.response.data.message || "Debes pagar la suscripción.");
      } else {
        alert("Ocurrió un error al eliminar la clase.");
      }
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Cargando clases...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] px-6 py-8">
      <h2 className="text-2xl font-bold text-[#007AFF] mb-4">Mis Clases</h2>
      {clases.length === 0 ? (
        <p>No tienes clases creadas.</p>
      ) : (
        <ul className="space-y-4">
          {clases.map((clase) => (
            <li
              key={clase.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold">{clase.title}</h3>
                <p className="text-sm text-gray-600">{clase.description}</p>
                <p className="text-xs text-gray-500">
                  Categoría: {clase.category?.name || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  Profesor: {clase.teacher?.name || "-"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSoftDelete(clase.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
