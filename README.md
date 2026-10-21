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
- Puedes consultar el historial, editar entradas y eliminarlas desde la API.
- Cada corrección tiene una explicación y una categoría. Las explicaciones y las sugerencias de vocabulario se adaptan al nivel elegido, de A1 a C2.
- La API ofrece un resumen de errores por categoría y un puntaje orientativo. Ese puntaje no mide tu dominio del inglés.

El corrector actual funciona con **reglas limitadas**. Detecta casos como `goed`, `eated`, `recieve`, el pronombre `i` y algunos errores de puntuación. Todavía no comprende todo el texto ni revisa conectores de forma general. La corrección contextual con IA y una vista para comparar la evolución entre meses forman parte de lo que quiero desarrollar.

La demo de GitHub Pages usa su propio corrector local y guarda el historial en el navegador. **No está conectada al PostgreSQL local.** Las funciones nuevas de edición, eliminación y resumen del backend todavía necesitan controles en el frontend.

## Cómo está organizado

- [`frontend/`](frontend/): interfaz en Angular y Tailwind, incluida la demo de GitHub Pages.
- [`backend/apidiario/`](backend/apidiario/): API en Java 21 y Spring Boot 4.0.8, con Spring Data JPA, PostgreSQL y Swagger.

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

Se verificaron **7 pruebas sin fallos**, incluyendo peticiones HTTP con Tomcat y H2. También se comprobó localmente el guardado de entradas y correcciones en PostgreSQL. Las pruebas automatizadas no usan tu base personal.

## Ejecutar el frontend local

Desde `frontend`:

```powershell
npm ci
npm start
```

Abre [http://localhost:4200](http://localhost:4200). La configuración de desarrollo apunta al backend en `http://localhost:8080/api`.

## Guías del backend

- [Instalación y alcance del backend](backend/apidiario/README.md)
- [Guía paso a paso](backend/apidiario/docs/GUIA_PASO_A_PASO.md)
- [Primera lectura del código](backend/apidiario/docs/PRIMERA_LECTURA.md)
- [Endpoints y ejemplos](backend/apidiario/docs/ENDPOINTS.md)
- [Validación realizada](backend/apidiario/docs/VALIDACION.md)

## Estado del proyecto

Esta versión del backend es para aprendizaje y uso local. Los perfiles todavía no tienen login ni autenticación. Antes de ofrecer diarios privados para varias personas, falta implementar autenticación, autorización y controles para que cada persona acceda a sus propias entradas.
