import React from 'react'
import { Link } from 'react-router-dom'
const ConoceMas: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-10">Conocé Más Sobre MentorHub</h1>

   
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔍 ¿Cómo funciona MentorHub?</h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 text-lg">
          <li>Registrate en nuestra plataforma como estudiante o mentor.</li>
          <li>Explorá las áreas de conocimiento disponibles.</li>
          <li>Conectate con un mentor o alumno según tu perfil.</li>
          <li>Programá tus sesiones y empezá a aprender o enseñar.</li>
          <li>Evaluá tus progresos y recibí feedback personalizado.</li>
        </ol>
      </section>

    
      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">👨‍🏫 Mentores</h3>
          <p className="text-gray-700 text-base">
            Compartí tus conocimientos, ayudá a otros a crecer y generá impacto en personas que buscan avanzar en sus carreras o estudios. Organizá tus horarios y recibí valoraciones por tu aporte.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">🎓 Estudiantes</h3>
          <p className="text-gray-700 text-base">
            Encontrá mentores en las áreas que te interesan, accedé a recursos exclusivos y aprendé con acompañamiento personalizado en tu camino educativo o profesional.
          </p>
        </div>
      </section>

      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Áreas de conocimiento disponibles</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg text-center font-medium">Desarrollo Web</div>
          <div className="bg-blue-50 p-4 rounded-lg text-center font-medium">Marketing Digital</div>
          <div className="bg-blue-50 p-4 rounded-lg text-center font-medium">Inglés Técnico</div>
          <div className="bg-blue-50 p-4 rounded-lg text-center font-medium">Productividad</div>
          <div className="bg-blue-50 p-4 rounded-lg text-center font-medium">Diseño UX/UI</div>
          <div className="bg-blue-50 p-4 rounded-lg text-center font-medium">Data Science</div>
        </div>
      </section>

      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🗣️ Testimonios</h2>
        <div className="space-y-6">
          <blockquote className="italic text-gray-600 border-l-4 border-blue-600 pl-4">
            "Gracias a MentorHub conseguí mi primer trabajo como desarrollador. Los mentores me guiaron paso a paso."
            <br />
            <span className="text-sm font-medium text-blue-700">— Javier R., ex-estudiante</span>
          </blockquote>
          <blockquote className="italic text-gray-600 border-l-4 border-blue-600 pl-4">
            "Compartir mi experiencia ayudó a otros y me motivó a seguir aprendiendo también."
            <br />
            <span className="text-sm font-medium text-blue-700">— Ana M., mentora</span>
          </blockquote>
        </div>
      </section>

      {/* CTA final */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Estás listo para empezar?</h2>
        <p className="text-gray-700 mb-6">Registrate gratis y sumate a nuestra comunidad de aprendizaje colaborativo.</p>
        <Link to="/login">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">

          Registrarme ahora
        </button>
        </Link>
      </section>
    </div>
  )
}

export default ConoceMas
