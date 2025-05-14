import React from 'react'

interface Class {
  id: number
  name: string
  description: string
  date: string
}

const Clases: React.FC = () => {
  const classes: Class[] = [
    {
      id: 1,
      name: 'Desarrollo Web Avanzado',
      description: 'Aprende las tecnologías más avanzadas para el desarrollo web.',
      date: '2025-05-20',
    },
    {
      id: 2,
      name: 'Introducción a React',
      description: 'Comienza tu camino en el desarrollo frontend con React.',
      date: '2025-06-10',
    },
    {
      id: 3,
      name: 'Gestión de Proyectos Ágiles',
      description: 'Domina las metodologías ágiles para gestionar proyectos de manera efectiva.',
      date: '2025-07-15',
    },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Clases a las que estás inscrito</h1>

      <div className="space-y-6">
        {classes.map((clase) => (
          <div key={clase.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800">{clase.name}</h2>
            <p className="text-gray-600 mt-2">{clase.description}</p>
            <p className="text-sm text-gray-500 mt-4">Fecha de inicio: {clase.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Clases
