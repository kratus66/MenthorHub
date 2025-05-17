const materiasPorCategoria: Record<
   string,
   { nombre: string; imagen: string }[]
> = {
   Musica: [
      { nombre: 'Álgebra', imagen: '/img/algebra.png' },
      { nombre: 'Geometría', imagen: '/img/geometria.png' },
   ],
   Matematica: [
      { nombre: 'Poesía', imagen: '/img/poesia.png' },
      { nombre: 'Narrativa', imagen: '/img/narrativa.png' },
   ],
   // ...otras categorías
};

export default materiasPorCategoria;
