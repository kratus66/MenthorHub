import React, { useState } from 'react'

interface User {
  name: string
  email: string
  subscriptionActive: boolean
}

const UserProfile: React.FC = () => {
  const [user] = useState<User>({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    subscriptionActive: true, 
  })

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans text-gray-900">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Perfil de Usuario</h1>

      <div className="bg-gray-50 rounded-lg p-8 shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-lg text-gray-600 mt-4">Correo: {user.email}</p>

        <div className="mt-8">
          <p className={`text-lg font-medium ${user.subscriptionActive ? 'text-green-500' : 'text-red-500'}`}>
            {user.subscriptionActive ? 'Suscripción activa' : 'Suscripción inactiva'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
