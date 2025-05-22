import { type FormEvent } from 'react';
import emailjs from '@emailjs/browser';



const Home = () => {
  
const sendEmail = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  emailjs
    .sendForm(
      'service_proyecto',  
      'template',  
      e.currentTarget,
      'a-MqQ_mBDlPAotyFU'    
    )
    .then(() => {
      alert("Correo enviado con éxito!");
      e.currentTarget.reset();
    })
    .catch((error) => {
  console.error("Error al enviar el correo:", error);
  alert("Error al enviar el correo. Verifica los datos y la configuración de EmailJS.");
});

};

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="relative w-full h-[60vh] overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/videoHome.mp4" type="video/mp4" />
          Tu navegador no soporta el tag de video.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg z-10">Mentor Hub</h1>
        </div>
      </div>

      <section className="py-12 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10">¿Qué te brindamos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-50 shadow-lg rounded-2xl p-6 border-t-4 border-red-500 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">Mentoría Personalizada</h3>
            <p className="text-gray-600">
              Cada estudiante recibe acompañamiento directo de mentores especializados que guían su proceso de aprendizaje.
            </p>
          </div>
          <div className="bg-gray-50 shadow-lg rounded-2xl p-6 border-t-4 border-blue-500 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">Material Actualizado</h3>
            <p className="text-gray-600">
              Accede a contenido relevante, actualizado y adaptado a las necesidades del mercado tecnológico actual.
            </p>
          </div>
          <div className="bg-gray-50 shadow-lg rounded-2xl p-6 border-t-4 border-yellow-400 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">Proyectos Reales</h3>
            <p className="text-gray-600">
              Aplica lo aprendido desarrollando proyectos reales que puedes incluir en tu portafolio profesional.
            </p>
          </div>
          <div className="bg-gray-50 shadow-lg rounded-2xl p-6 border-t-4 border-pink-400 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">Comunidad Estudiantil</h3>
            <p className="text-gray-600">
              Forma parte de una comunidad activa de estudiantes y mentores donde podrás intercambiar ideas, resolver dudas y crecer en equipo.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-20 bg-indigo-600 text-white rounded-lg mx-6 md:mx-20 my-12 text-center shadow-lg">
        <h2 className="text-4xl font-bold mb-4">¿Listo para transformar tu futuro?</h2>
        <p className="mb-6 max-w-3xl mx-auto text-lg">
          Únete a Mentor Hub y comienza tu camino hacia una carrera tecnológica exitosa con el mejor acompañamiento.
        </p>
        <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Inscribirme Ahora
        </button>
      </section>
      <section className="py-12 px-6 md:px-20 bg-white mt-8">
  <h2 className="text-3xl font-semibold text-center mb-6">¿Tenés alguna duda?</h2>
  <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
    Escribinos y te responderemos lo antes posible. Estamos acá para ayudarte en tu camino educativo.
  </p>
  <form onSubmit={sendEmail} className="max-w-2xl mx-auto grid gap-6">
  <input
    type="text"
    name="user_name"
    placeholder="Tu nombre"
    className="w-full border px-4 py-3 rounded-xl"
    required
  />
  <input
    type="email"
    name="user_email"
    placeholder="Tu correo"
    className="w-full border px-4 py-3 rounded-xl"
    required
  />
  <textarea
    name="message"
    placeholder="Tu mensaje"
    rows={4}
    className="w-full border px-4 py-3 rounded-xl resize-none"
    required
  />
  <button
    type="submit"
    className="bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
  >
    Enviar mensaje
  </button>
</form>

</section>

    </div>
  );
};

export default Home;
