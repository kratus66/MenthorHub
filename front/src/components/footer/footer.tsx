import React from "react";

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div
        className="w-full h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?mentor,education')",
        }}
      >
        <h1 className="text-5xl font-bold drop-shadow-lg">Mentor Hub</h1>
      </div>

      {/* Información que brindan los cursos */}
      <section className="py-12 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10">¿Qué te brindamos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info 1 */}
          <div className="bg-gray-50 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Mentoría Personalizada</h3>
            <p className="text-gray-600">
              Cada estudiante recibe acompañamiento directo de mentores especializados que guían su proceso de aprendizaje.
            </p>
          </div>

          {/* Info 2 */}
          <div className="bg-gray-50 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Material Actualizado</h3>
            <p className="text-gray-600">
              Accede a contenido relevante, actualizado y adaptado a las necesidades del mercado tecnológico actual.
            </p>
          </div>

          {/* Info 3 */}
          <div className="bg-gray-50 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Proyectos Reales</h3>
            <p className="text-gray-600">
              Aplica lo aprendido desarrollando proyectos reales que puedes incluir en tu portafolio profesional.
            </p>
          </div>

          {/* Info 4 */}
          <div className="bg-gray-50 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Comunidad Estudiantil</h3>
            <p className="text-gray-600">
              Forma parte de una comunidad activa de estudiantes y mentores donde podrás intercambiar ideas, resolver dudas y crecer en equipo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
