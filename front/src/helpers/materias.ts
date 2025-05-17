const materiasPorCategoria: Record<
   string,
   { id: string; nombre: string; imagen: string }[]
> = {
   Musica: [
      {
         nombre: 'Teoría Musical',
         imagen: '/materia-test.jpg',
         id: 'Teoria Musical',
      },
      {
         nombre: 'Historia de la música',
         imagen: '/materia-test.jpg',
         id: 'Historia de la musica',
      },
      {
         nombre: 'Composición y Armonía',
         imagen: '/materia-test.jpg',
         id: 'Composicion y Armonia',
      },
      { nombre: 'Guitarra', imagen: '/materia-test.jpg', id: 'Guitarra' },
      { nombre: 'Piano', imagen: '/materia-test.jpg', id: 'Piano' },
      {
         nombre: 'Producción Musical Digital',
         imagen: '/materia-test.jpg',
         id: 'Produccion Musical Digital',
      },
      {
         nombre: 'Canto y Técnica Vocal',
         imagen: '/materia-test.jpg',
         id: 'Canto y Tecnica Vocal',
      },
      {
         nombre: 'Música del Mundo',
         imagen: '/materia-test.jpg',
         id: 'Musica del Mundo',
      },
      {
         nombre: 'Apreciación Musical',
         imagen: '/materia-test.jpg',
         id: 'Apreciacion Musical',
      },
   ],
   Matematica: [
      {
         nombre: 'Literatura Clásica',
         imagen: '/materia-test.jpg',
         id: 'Literatura Clasica',
      },
      {
         nombre: 'Literatura Moderna',
         imagen: '/materia-test.jpg',
         id: 'Literatura Moderna',
      },
      {
         nombre: 'Teoría Literaria',
         imagen: '/materia-test.jpg',
         id: 'Teoria Literaria',
      },
      {
         nombre: 'Escritura Creativa',
         imagen: '/materia-test.jpg',
         id: 'Escritura Creativa',
      },
      {
         nombre: 'Poesía y Versificación',
         imagen: '/materia-test.jpg',
         id: 'Poesia y Versificacion',
      },
      { nombre: 'Narrativa', imagen: '/materia-test.jpg', id: 'Narrativa' },
      {
         nombre: 'Análisis Literario',
         imagen: '/materia-test.jpg',
         id: 'Analisis Literario',
      },
      { nombre: 'Dramaturgia', imagen: '/materia-test.jpg', id: 'Dramaturgia' },
   ],
   Ciencia: [
      { nombre: 'Matemática', imagen: '/materia-test.jpg', id: 'Matematica' },
      { nombre: 'Física', imagen: '/materia-test.jpg', id: 'Fisica' },
      { nombre: 'Química', imagen: '/materia-test.jpg', id: 'Quimica' },
      { nombre: 'Biología', imagen: '/materia-test.jpg', id: 'Biologia' },
      { nombre: 'Astronomía', imagen: '/materia-test.jpg', id: 'Astronomia' },
      { nombre: 'Ecología', imagen: '/materia-test.jpg', id: 'Ecologia' },
      {
         nombre: 'Ciencias de la Tierra',
         imagen: '/materia-test.jpg',
         id: 'Ciencias de la Tierra',
      },
      { nombre: 'Genética', imagen: '/materia-test.jpg', id: 'Genetica' },
   ],
   Finanzas: [
      {
         nombre: 'Programación',
         imagen: '/materia-test.jpg',
         id: 'Programacion',
      },
      { nombre: 'Robótica', imagen: '/materia-test.jpg', id: 'Robotica' },
      { nombre: 'Diseño Web', imagen: '/materia-test.jpg', id: 'Diseno Web' },
      {
         nombre: 'Inteligencia Artificial',
         imagen: '/materia-test.jpg',
         id: 'Inteligencia Artificial',
      },
      {
         nombre: 'Redes y Comunicaciones',
         imagen: '/materia-test.jpg',
         id: 'Redes y Comunicaciones',
      },
      {
         nombre: 'Ciberseguridad',
         imagen: '/materia-test.jpg',
         id: 'Ciberseguridad',
      },
      {
         nombre: 'Desarrollo de Videojuegos',
         imagen: '/materia-test.jpg',
         id: 'Desarrollo de Videojuegos',
      },
      {
         nombre: 'Tecnologías Emergentes',
         imagen: '/materia-test.jpg',
         id: 'Tecnologias Emergentes',
      },
   ],
   Lenguajes: [
      { nombre: 'Filosofía', imagen: '/materia-test.jpg', id: 'Filosofia' },
      { nombre: 'Sociología', imagen: '/materia-test.jpg', id: 'Sociologia' },
      { nombre: 'Psicología', imagen: '/materia-test.jpg', id: 'Psicologia' },
      {
         nombre: 'Historia Universal',
         imagen: '/materia-test.jpg',
         id: 'Historia Universal',
      },
      {
         nombre: 'Antropología',
         imagen: '/materia-test.jpg',
         id: 'Antropologia',
      },
      { nombre: 'Ética', imagen: '/materia-test.jpg', id: 'Etica' },
      {
         nombre: 'Religión Comparada',
         imagen: '/materia-test.jpg',
         id: 'Religion Comparada',
      },
   ],
   Historia: [
      { nombre: 'Inglés', imagen: '/materia-test.jpg', id: 'Ingles' },
      { nombre: 'Francés', imagen: '/materia-test.jpg', id: 'Frances' },
      { nombre: 'Alemán', imagen: '/materia-test.jpg', id: 'Aleman' },
      { nombre: 'Portugués', imagen: '/materia-test.jpg', id: 'Portugues' },
      { nombre: 'Italiano', imagen: '/materia-test.jpg', id: 'Italiano' },
      {
         nombre: 'Chino Mandarín',
         imagen: '/materia-test.jpg',
         id: 'Chino Mandarin',
      },
      { nombre: 'Japonés', imagen: '/materia-test.jpg', id: 'Japones' },
      {
         nombre: 'Español Avanzado',
         imagen: '/materia-test.jpg',
         id: 'Espanol Avanzado',
      },
   ],
   Geografia: [
      { nombre: 'Pintura', imagen: '/materia-test.jpg', id: 'Pintura' },
      { nombre: 'Dibujo', imagen: '/materia-test.jpg', id: 'Dibujo' },
      { nombre: 'Escultura', imagen: '/materia-test.jpg', id: 'Escultura' },
      { nombre: 'Fotografía', imagen: '/materia-test.jpg', id: 'Fotografia' },
      { nombre: 'Cine', imagen: '/materia-test.jpg', id: 'Cine' },
      {
         nombre: 'Historia del Arte',
         imagen: '/materia-test.jpg',
         id: 'Historia del Arte',
      },
      {
         nombre: 'Diseño Gráfico',
         imagen: '/materia-test.jpg',
         id: 'Diseno Grafico',
      },
      {
         nombre: 'Arte Digital',
         imagen: '/materia-test.jpg',
         id: 'Arte Digital',
      },
   ],
   Deporte: [
      { nombre: 'Fútbol', imagen: '/materia-test.jpg', id: 'Futbol' },
      { nombre: 'Básquetbol', imagen: '/materia-test.jpg', id: 'Basquetbol' },
      { nombre: 'Atletismo', imagen: '/materia-test.jpg', id: 'Atletismo' },
      { nombre: 'Natación', imagen: '/materia-test.jpg', id: 'Natacion' },
      { nombre: 'Gimnasia', imagen: '/materia-test.jpg', id: 'Gimnasia' },
      { nombre: 'Tenis', imagen: '/materia-test.jpg', id: 'Tenis' },
      { nombre: 'Vóleibol', imagen: '/materia-test.jpg', id: 'Voleibol' },
   ],
   Salud: [
      {
         nombre: 'Educación Sexual Integral',
         imagen: '/materia-test.jpg',
         id: 'Educacion Sexual Integral',
      },
      { nombre: 'Nutrición', imagen: '/materia-test.jpg', id: 'Nutricion' },
      {
         nombre: 'Primeros Auxilios',
         imagen: '/materia-test.jpg',
         id: 'Primeros Auxilios',
      },
      {
         nombre: 'Salud Mental',
         imagen: '/materia-test.jpg',
         id: 'Salud Mental',
      },
      {
         nombre: 'Higiene y Prevención',
         imagen: '/materia-test.jpg',
         id: 'Higiene y Prevencion',
      },
      {
         nombre: 'Anatomía Humana',
         imagen: '/materia-test.jpg',
         id: 'Anatomia Humana',
      },
   ],
};

export default materiasPorCategoria;
