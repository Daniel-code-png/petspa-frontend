// Función para formatear fecha sin problemas de zona horaria
export const formatDateDisplay = (dateString) => {
  const date = new Date(dateString);
  // Sumar el offset de zona horaria para obtener la fecha correcta
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
  return localDate.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función para obtener fecha en formato YYYY-MM-DD sin conversión UTC
export const getLocalDateString = (dateString) => {
  const date = new Date(dateString);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
};

// Función para crear fecha desde string sin conversión UTC
export const createLocalDate = (dateString) => {
  return new Date(dateString + 'T12:00:00');
};