# Despliegue público verificado

Aplicación actual: https://diario-idiomas.vercel.app/#escribir

## Publicación inicial — 23 de octubre de 2026

Dominio inicial: https://diario-idiomas.onrender.com/#escribir

Frontend React y backend Spring Boot se sirven juntos por HTTPS en Render, plan Free ($0), región Oregon. La base de datos PostgreSQL está en Neon. Las credenciales se configuran como variables privadas de Render y no se incluyen en Git.

Versión de código verificada: `506c6c66236912ceb2f63587f67a90642feee422`. Render confirmó el estado `Deploy succeeded / Live` para el despliegue `dep-dbe2n4nf3r2c73cgtit0`. Las pruebas de esa versión pasaron: 12 en backend y 9 en frontend.

## Comprobación pública real

- `/api/health` devolvió HTTP 200 y `status: ok`.
- Registro de una cuenta temporal, inicio de sesión y creación de una entrada en Neon.
- El texto sin punto final se conservó sin penalización.
- Una segunda sesión independiente de la misma cuenta pudo consultar la entrada.
- Una solicitud anónima recibió 401 y una cuenta diferente no pudo consultar ni borrar la entrada (404).
- La cookie de sesión tenía Secure y HttpOnly.
- El cierre de sesión invalidó el acceso posterior.
- Las cuentas y entradas creadas para esta verificación se eliminaron al terminar.

## Uso y límites

Cada persona crea su cuenta y utiliza el mismo correo y contraseña desde sus dispositivos. Las entradas guardadas se sincronizan; los borradores permanecen por cuenta en el navegador. No hay recuperación automática de contraseña ni verificación por correo en esta versión. Los antiguos perfiles sin contraseña no pueden reclamarse solo por email.

El servicio gratuito puede suspenderse por inactividad y tardar en responder a la primera apertura. Los reinicios invalidan las sesiones en memoria, pero las entradas permanecen en Neon. El repositorio público se conectó por URL: los nuevos commits necesitan un despliegue manual desde Render. Las automatizaciones n8n siguen siendo locales y están desactivadas en Render hasta configurar una instancia remota.


## Frontend independiente — 24 de octubre de 2026

- Frontend React estático: https://diario-idiomas.vercel.app, proyecto `diario-idiomas`, equipo `cathv24`, plan Hobby.
- API: https://diario-idiomas.onrender.com/api, servicio Free existente, con PostgreSQL en Neon.
- Fuente del frontend y de la API desplegados: `bf33a0fccfcf5932e678a8420e3c70ee184e5395`.
- Vercel confirmó la publicación y asignación del dominio. Render confirmó `Your service is live` para `dep-dbeloebrjlhs7383qgqg`.
- La integración GitHub de Vercel fue autorizada solo para `cathv-24/diario_idioma`. Los commits de main publican el frontend automáticamente; el servicio Render sigue requiriendo despliegue manual.

### Configuración

`vercel.json` usa la raíz del repositorio, instala en `frontend`, compila con `VITE_API_URL=/api` y publica `frontend/dist`. Reenvía `/api` hacia Render y evita cachear sus respuestas. Los recursos con nombre versionado se cachean por un año.

`FRONTEND_ORIGIN` de Render contiene únicamente `https://diario-idiomas.onrender.com,https://diario-idiomas.vercel.app`. Las cookies de sesión permanecen en el origen del frontend gracias al proxy. No se cambiaron las protecciones de autenticación ni se copiaron credenciales de Neon a Vercel.

### Comprobación real del nuevo dominio

- HTML público: HTTP 200, aproximadamente 0,35 s en una petición puntual. Es tiempo de respuesta del HTML, no LCP ni garantía para todas las redes.
- El navegador mostró el formulario con la comprobación de sesión en segundo plano.
- `/api/health`: 200, con el origen Vercel permitido.
- Consulta anónima a `/api/auth/me`: 401.
- POST de acceso sin CSRF: 403.
- Cookie: `JSESSIONID`, Secure, HttpOnly, SameSite=Lax; no se registraron sus valores.
- Registro e inicio de sesión reales desde el formulario publicado con una cuenta QA temporal.
- Guardado desde la interfaz de una entrada sin punto final; el backend devolvió dos correcciones y conservó el final informal.
- Cierre de sesión, nuevo acceso y recuperación de la entrada desde el historial, también después de recargar la página.
- PostgreSQL/Neon confirmó la cuenta QA y su entrada. Tras cerrar la sesión se eliminaron exclusivamente esa cuenta, su entrada y sus dos correcciones, con condiciones de propietario y contenido de prueba.

Validación local del frontend: 17 pruebas aprobadas, incluida la concurrencia entre una comprobación de sesión lenta y un acceso nuevo; compilación TypeScript/Vite correcta. La revisión independiente emitió `ship` para la fusión visual local y los cambios de arranque. Esta comprobación cloud posterior aporta la evidencia de publicación y persistencia.

### Límite que permanece

Vercel sirve la interfaz sin esperar al inicio del backend. Render Free todavía puede suspender la API por inactividad; entrar, consultar o guardar puede tardar mientras despierta. Un despliegue de esta verificación registró 129,4 s de arranque de Spring Boot; no se presenta ese dato como una duración garantizada de cada despertar. El reinicio invalida sesiones en memoria, pero conserva las entradas en Neon.
