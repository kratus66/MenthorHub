import React from 'react'
import Login from '../Login/Login'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-400 to-slate-300 text-white px-4">
      <h1 className="text-6xl font-bold mb-8 drop-shadow-lg">MentorHub</h1>

      <Login />

      
    </div>
  )
}

export default Landing
