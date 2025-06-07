export const formatearFecha = (fechaISO: string): string => {
   const fecha = new Date(fechaISO);

   const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
   };

   const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

   return fechaFormateada.replace(/ de (\d{4})$/, ', $1');
};
