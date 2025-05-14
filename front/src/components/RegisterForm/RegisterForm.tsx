import React, { useState } from 'react'

interface FormData {
  estudios: string
  rol: string
  localidad: string
  provincia: string
  pais: string
}

const RegisterForm: React.FC<{ onSubmit: (formData: FormData) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    estudios: '',
    rol: '',
    localidad: '',
    provincia: '',
    pais: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData) // Llama la función pasada por props con los datos del formulario
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="estudios" className="block text-sm font-semibold text-gray-700">Estudios</label>
        <select
          name="estudios"
          id="estudios"
          value={formData.estudios}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 border rounded-md"
        >
          <option value="">Selecciona tu nivel de estudios</option>
          <option value="Secundario">Secundario</option>
          <option value="Terciario">Terciario</option>
          <option value="Universitario">Universitario</option>
        </select>
      </div>

      <div>
        <label htmlFor="rol" className="block text-sm font-semibold text-gray-700">Rol</label>
        <select
          name="rol"
          id="rol"
          value={formData.rol}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 border rounded-md"
        >
          <option value="">Selecciona tu rol</option>
          <option value="Estudiante">Estudiante</option>
          <option value="Profesor">Profesor</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div>
        <label htmlFor="localidad" className="block text-sm font-semibold text-gray-700">Localidad</label>
        <input
          type="text"
          name="localidad"
          id="localidad"
          value={formData.localidad}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 border rounded-md"
          placeholder="Ej: Ciudad de México"
        />
      </div>

      <div>
        <label htmlFor="provincia" className="block text-sm font-semibold text-gray-700">Provincia</label>
        <input
          type="text"
          name="provincia"
          id="provincia"
          value={formData.provincia}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 border rounded-md"
          placeholder="Ej: Jalisco"
        />
      </div>

      <div>
        <label htmlFor="pais" className="block text-sm font-semibold text-gray-700">País</label>
        <input
          type="text"
          name="pais"
          id="pais"
          value={formData.pais}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 border rounded-md"
          placeholder="Ej: Argentina"
        />
      </div>

      <button
        type="submit"
        className="w-full p-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition"
      >
        Registrarse
      </button>
    </form>
  )
}

export default RegisterForm
