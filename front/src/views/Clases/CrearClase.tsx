import { useRef, useState } from "react";
import { ImageIcon, Video, Paperclip } from "lucide-react";

export default function CrearClase() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState(""); // podés setearlo por defecto si ya lo sabés
  const [categoryId, setCategoryId] = useState("");
  const [materia, setMateria] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);

  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setArchivos((prev) => [...prev, ...Array.from(selectedFiles)]);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("teacherId", teacherId);
  formData.append("categoryId", categoryId);
  formData.append("materia", materia);

  archivos.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    const res = await fetch("http://localhost:3001/api/classes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Error creando clase: " + res.statusText);
    }

    const data = await res.json();
    console.log("Clase creada:", data);
  } catch (err) {
    console.error("Error al crear la clase:", err);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Materia"
        value={materia}
        onChange={(e) => setMateria(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="ID del profesor"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="ID de la categoría"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      {/* Botones para subir archivos */}
      <div className="flex gap-4">
        <button type="button" onClick={() => imageInputRef.current?.click()}>
          <ImageIcon />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleFileChange}
          hidden
        />

        <button type="button" onClick={() => videoInputRef.current?.click()}>
          <Video />
        </button>
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          onChange={handleFileChange}
          hidden
        />

        <button type="button" onClick={() => fileInputRef.current?.click()}>
          <Paperclip />
        </button>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.zip,.rar"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />
      </div>

      {/* Lista de archivos cargados */}
      {archivos.length > 0 && (
        <ul className="text-sm mt-2">
          {archivos.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear Clase
      </button>
    </form>
  );
}
