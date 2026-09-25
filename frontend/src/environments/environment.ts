// Entorno de DESARROLLO (ng serve).
// Si el backend está corriendo en localhost:8080 se usa; si falla, la app cae
// automáticamente al corrector local en el navegador.
export const environment = {
  produccion: false,
  apiUrl: 'http://localhost:8080/api',
};
