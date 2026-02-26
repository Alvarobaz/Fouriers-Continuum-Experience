// environment.prod.ts

// Staging/Producción: URL relativa, pasa por el proxy nginx.
// Nginx enruta /api/* al backend Spring Boot.
// Al ser relativa, el navegador usa el mismo origen → sin CORS.
// IMPORTANTE: debe terminar en '/' (ver interceptor.service.ts).
  
export const environment = {
  production: true,
  apiBaseUrl: '/api/'

};
