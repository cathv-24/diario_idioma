# 📖 Diario de Idiomas

Un diario para escribir tu día **en inglés** y recibir correcciones al guardar tu entrada. Le cuentas cómo te fue, y la app te devuelve tu texto corregido, te explica en qué te equivocaste (según tu nivel) y te va mostrando en qué temas fallas más. La idea es aprender sin que se sienta como estudiar.

## Por qué lo hice

La verdad es que este proyecto nació de algo personal. Mi psicólogo me recomendó escribir un diario para desahogarme, para sacar lo que siento en el día, sea bueno o malo. Me encantó la idea, pero pensé: ¿y si además de desahogarme aprovecho para aprender algo?

Yo sé inglés, pero básico, y justo estoy tratando de mejorarlo. El problema es que cuando escribo un diario a mano o en las notas del celular, no hay nada que me diga si lo estoy escribiendo bien, si usé mal un conector o si hay una mejor forma de decir las cosas. Así que se me ocurrió juntar las dos cosas: un diario donde escribo cómo fue mi día y, al corregirlo, se guarda solito en un historial (parecido a la app de Notas) y me va corrigiendo. Del tipo "oye, este conector no va, mejor usa este otro" o "vas bien, solo corrige esto".

Y con el historial puedo ver cómo voy mejorando con el tiempo. Quizás en agosto escribía con varios errores y para septiembre ya escribo mejor. Esa es la gracia.

## 🌐 Pruébalo aquí

**👉 https://cathv-24.github.io/diario_idioma/**

Funciona directo en el navegador, no necesitas instalar nada. Escribe algo en inglés, dale a "Corregir mi día" y listo. Tu historial se guarda en tu propio navegador.


## Qué hace hoy

La aplicación tiene una demo en el navegador y un backend local. La idea de fondo es la misma: escribir, recibir una explicación y guardar la entrada para volver a leerla después.

- Escribes tu día en inglés y solicitas la corrección.
- El backend guarda el texto original, el corregido y las correcciones en PostgreSQL.
- Puedes consultar el historial, buscar por texto, filtrar por nivel, editar y eliminar entradas desde la interfaz.
- Tu borrador conserva el texto, la fecha y la entrada que estás editando al recargar.
- Puedes exportar tu historial como JSON y ver un gráfico de las últimas 12 entradas.
- Cada corrección tiene una explicación y una categoría. Las explicaciones y las sugerencias de vocabulario se adaptan al nivel elegido, de A1 a C2.
- La API ofrece un resumen de errores por categoría y un puntaje orientativo. Ese puntaje no mide tu dominio del inglés.

El corrector actual funciona con **reglas limitadas**. Detecta casos como `goed`, `eated`, `recieve`, el pronombre `i` y errores concretos de ortografía. Todavía no comprende todo el texto ni revisa conectores de forma general. La corrección contextual con IA y una vista para comparar la evolución entre meses forman parte de lo que quiero desarrollar.

La demo de GitHub Pages usa su propio corrector local y guarda el historial en el navegador. **No está conectada a una API pública ni a Neon directamente.** En desarrollo, React consume Spring Boot y el backend guarda en PostgreSQL o Neon. Las credenciales de base de datos nunca llegan al navegador.

## Cómo está organizado

- [`frontend/`](frontend/): interfaz en React, Vite, TypeScript y Tailwind CSS. Sustituye al frontend Angular a partir del nuevo alcance de octubre de 2026.
- [`backend/apidiario/`](backend/apidiario/): API en Java 21 y Spring Boot 4.0.8, con Spring Data JPA, PostgreSQL y Swagger.
- [`automations/`](automations/): flujos n8n para registrar métricas de creación y guardar un informe semanal agregado en Neon, sin enviar textos personales ni mensajes.

La portada usa Instrument Serif e Inter, el vídeo facilitado como referencia y un bucle manual con fundidos. El vídeo se puede pausar y se respeta la preferencia de movimiento reducido.

El backend está organizado en entidades, repositorios, interfaces de servicios, implementaciones, controladores y DTO. Es una sola aplicación por capas. Estoy usando la teoría de Arquitectura de Aplicaciones Web como referencia para entender y justificar cada parte.

## Ejecutar el backend

Necesitas **JDK 21**. Abre `backend/apidiario` como proyecto Maven en IntelliJ o entra a esa carpeta desde la terminal.

### Con PostgreSQL

1. Crea una base vacía llamada `db_diario_idiomas`.
2. Copia `application-local.properties.example` como `application-local.properties`, dentro de `backend/apidiario`.
3. Completa tu usuario y contraseña locales en la copia. Ese archivo está excluido de Git.
4. Ejecuta desde `backend/apidiario`, sin activar el perfil `h2`:

```powershell
.\mvnw.cmd spring-boot:run
```

También puedes configurar `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` como variables de entorno en lugar de crear el archivo local.

### Para probar con H2 en memoria

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```

Con H2, los datos desaparecen al detener el servidor.

Una vez iniciado el backend:

- [Swagger](http://localhost:8080/swagger-ui/index.html)
- [OpenAPI](http://localhost:8080/v3/api-docs)
- `GET /api/usuarios`: permite consultar el identificador del perfil de demostración.

### Compilar y ejecutar las pruebas

Desde `backend/apidiario`:

```powershell
.\mvnw.cmd clean verify
```

Se verificaron **12 pruebas sin fallos**, incluyendo peticiones HTTP con Tomcat/H2 y la integración opcional con n8n. Las pruebas automatizadas no usan tu base personal.

## Ejecutar el frontend local

Desde `frontend`:

```powershell
npm ci
npm start
```

Abre la dirección que muestra Vite, normalmente [http://127.0.0.1:5173](http://127.0.0.1:5173). En desarrollo, `/api` pasa por el proxy de Vite hacia `http://127.0.0.1:8080`.

Para probar el modo demo sin backend: `npm run build` y después `npm run preview`. La compilación de producción usa demo local si `VITE_API_URL` está vacía. No se cambia de API a demo silenciosamente cuando una petición falla.

```powershell
npm test
npm run build
```

## Neon y n8n

La conexión de Spring a Neon se configura de forma privada con TLS. El proyecto de desarrollo es `diario-idiomas`, rama `diario-app`, base `diario_idiomas`. No se migran automáticamente los datos de tu PostgreSQL anterior.

- [Configuración y flujos n8n](automations/README.md)
- [Esquema de métricas](automations/sql/001_automation_schema.sql)
- [Verificación del frontend](frontend/VALIDACION.md)

El webhook registra metadatos de las entradas nuevas de forma idempotente. El informe semanal guarda actividad agregada del motor, no un diagnóstico de aprendizaje. Ambos flujos requieren una instancia de n8n en ejecución; subir los JSON al repositorio no los activa por sí solo.

## Guías del backend

- [Instalación y alcance del backend](backend/apidiario/README.md)
- [Guía paso a paso](backend/apidiario/docs/GUIA_PASO_A_PASO.md)
- [Primera lectura del código](backend/apidiario/docs/PRIMERA_LECTURA.md)
- [Endpoints y ejemplos](backend/apidiario/docs/ENDPOINTS.md)
- [Validación realizada](backend/apidiario/docs/VALIDACION.md)

## Estado del proyecto

La versión conectada incluye registro e inicio de sesión, contraseñas con BCrypt, sesión HttpOnly y protección CSRF. La API verifica la propiedad de cada perfil y entrada. El historial se guarda en Neon y se comparte entre dispositivos al entrar a la misma cuenta. La demo de GitHub Pages conserva únicamente datos locales.

### Escritura cotidiana y niveles

El editor utiliza Inter para facilitar la lectura. No se añade ni penaliza la falta de punto final. La guía A1–C2 incluye gramática, vocabulario, expresión oral y otras habilidades a partir del material aportado; el nivel se elige por autoevaluación y orienta las preguntas de escritura. No se estima ni certifica el nivel MCER con el puntaje del corrector. Las entradas históricas conservan sus correcciones; al editarlas se aplican las reglas actuales.

## Publicación para varias personas

El Dockerfile construye React y Spring Boot y sirve ambos bajo el mismo dominio HTTPS en Render. Seleccionar **Free** y región Oregon. Configurar `NEON_JDBC_URL` (con `sslmode=verify-full&sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory`), `NEON_DB_USERNAME` y `NEON_DB_PASSWORD` como variables privadas. Usar `/api/health` para la comprobación de salud. El puerto y perfil de producción ya están configurados.

Cada persona crea su propia cuenta con una contraseña de al menos 12 caracteres. Se puede abrir el mismo historial desde distintos dispositivos. Las sesiones caducan tras 12 horas de inactividad y se cierran al reiniciar el servidor; basta iniciar sesión nuevamente. Los borradores se guardan por cuenta en el navegador y no se sincronizan hasta guardar la entrada. No hay recuperación automática de contraseña ni verificación por correo en esta versión. Los perfiles de práctica anteriores sin contraseña no se pueden reclamar por email.

El plan gratuito de Render puede suspender el servicio tras inactividad; la primera apertura puede tardar. Neon conserva las entradas aunque Render se reinicie. Las automatizaciones n8n anteriores continúan configuradas localmente; no se expone n8n ni se envían eventos desde Render hasta configurar una instancia remota privada. Una publicación desde URL pública de Git requiere despliegues manuales desde el panel de Render para incorporar nuevos commits.

## Aplicación pública

[Abre Diario de Idiomas](https://diario-idiomas.onrender.com/#escribir). Crea tu cuenta y usa el mismo correo y contraseña en tus dispositivos. El servicio funciona en el plan gratuito de Render, con las entradas persistidas en Neon. La primera apertura tras inactividad puede tardar.
