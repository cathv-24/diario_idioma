# 📖 Diario de Idiomas

![Pages](https://img.shields.io/github/actions/workflow/status/cathv-24/diario_idioma/deploy-pages.yml?label=GitHub%20Pages)
![License](https://img.shields.io/badge/license-MIT-green)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-Angular-red)

Un diario para escribir tu día **en inglés** y que te corrija mientras escribes. Le cuentas cómo te fue, y la app te devuelve tu texto corregido, te explica en qué te equivocaste (según tu nivel) y te va mostrando en qué temas fallas más. La idea es aprender sin que se sienta como estudiar.

## Por qué lo hice

La verdad es que este proyecto nació de algo personal. Mi psicólogo me recomendó escribir un diario para desahogarme, para sacar lo que siento en el día, sea bueno o malo. Me encantó la idea, pero pensé: ¿y si además de desahogarme aprovecho para aprender algo?

Yo sé inglés, pero básico, y justo estoy tratando de mejorarlo. El problema es que cuando escribo un diario a mano o en las notas del celular, no hay nada que me diga si lo estoy escribiendo bien, si usé mal un conector o si hay una mejor forma de decir las cosas. Así que se me ocurrió juntar las dos cosas: un diario donde escribo cómo fue mi día y, al corregirlo, se guarda solito en un historial (parecido a la app de Notas) y me va corrigiendo. Del tipo "oye, este conector no va, mejor usa este otro" o "vas bien, solo corrige esto".

Y con el historial puedo ver cómo voy mejorando con el tiempo. Quizás en agosto escribía con varios errores y para septiembre ya escribo mejor. Esa es la gracia.

## 🌐 Pruébalo aquí

**👉 https://cathv-24.github.io/diario_idioma/**

Funciona directo en el navegador, no necesitas instalar nada. Escribe algo en inglés, dale a "Corregir mi día" y listo. Tu historial se guarda en tu propio navegador.

> **Nota:** la demo online usa un corrector que corre en el mismo navegador, porque GitHub Pages solo permite publicar la parte visual (el frontend). La parte del servidor (backend + base de datos) se corre en local, como explico más abajo. La app se da cuenta sola: si hay servidor lo usa, y si no, usa el corrector del navegador.

## Qué hace

- **Escribes tu día** en inglés y lo corriges con un clic.
- Te corrige **según tu nivel** (A1 a C2). Si estás en nivel básico, las explicaciones te salen en español; si ya estás más avanzada, te las da en inglés.
- Cada error viene **explicado** y con su categoría: ortografía, gramática, puntuación, vocabulario, artículos y mayúsculas.
- Te da un **puntaje** del 0 al 100 y un **resumen de los temas en los que más fallas**, para que sepas qué reforzar.
- Guarda todo en un **historial** para que veas tu progreso.

## Cómo está hecho

Lo armé con una arquitectura en capas, separando el backend del frontend.

```
proyecto_diario_idiomas/
├── backend/apidiario/        → API REST con Spring Boot (Java 21) + PostgreSQL
│   └── src/main/java/com/diario/apidiario/
│       ├── entidades/        → Usuario, EntradaDiario, Correccion
│       ├── enums/            → NivelIngles, CategoriaError
│       ├── dto/              → objetos para pasar datos entre capas
│       ├── repositorios/     → acceso a datos (JPA)
│       ├── servicios/        → la lógica; aquí vive el motor de corrección
│       ├── controladores/    → los endpoints REST
│       └── config/           → ModelMapper, CORS, Swagger, etc.
│
└── frontend/                 → App en Angular + Tailwind CSS
    └── src/app/
        ├── modelos/          → los tipos que reflejan la API
        ├── servicios/        → cliente HTTP + corrector local + estado
        ├── componentes/      → el resultado de la corrección
        └── paginas/          → escribir · historial
```

### El motor de corrección

Puse la corrección detrás de una interfaz (`ServicioCorreccion`) para poder cambiar cómo corrige sin tocar el resto de la app. Ahora mismo corrige con reglas, pero dejé listo el enganche para conectar un modelo de lenguaje más adelante.

| Implementación | Cuándo se usa | Qué hace |
|---|---|---|
| `CorrectorBasadoEnReglas` | por defecto | Corrige con reglas y diccionarios (verbos irregulares, contracciones, `a/an`, mayúsculas, puntuación…). No necesita internet. |
| `CorrectorLLM` | opcional | Le pide la corrección a un modelo de lenguaje. Si algo falla, vuelve solito a las reglas. |

### Tecnologías

- **Backend:** Java 21, Spring Boot, Spring Data JPA, ModelMapper, Lombok, Swagger.
- **Base de datos:** PostgreSQL (y H2 en memoria para probar sin instalar nada).
- **Frontend:** Angular, TypeScript, Tailwind CSS.
- **Herramientas:** Git y GitHub, GitHub Actions + GitHub Pages para el despliegue, Maven.

## Cómo correrlo en tu compu

Necesitas Java 21, Node.js y (opcional) PostgreSQL.

**La forma más rápida** (sin instalar base de datos, usa H2 en memoria):

```bash
cd backend/apidiario
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

```bash
cd frontend
npm install
npm start
```

Abre http://localhost:4200 y ya. Al arrancar, el backend crea un usuario de prueba para que puedas escribir de una vez.

**Con PostgreSQL** (si quieres que los datos se guarden de verdad): crea la base de datos `db_diario_idiomas`, revisa las credenciales en `application.properties` (se pueden pasar por variables de entorno) y arranca el backend sin el `-Dspring-boot.run.profiles=h2`.

La documentación de la API queda en http://localhost:8080/swagger-ui.html

## Los endpoints principales

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/api/entrada` | Escribir una entrada y recibir la corrección |
| GET | `/api/entradas/{idUsuario}` | Ver el historial de un usuario |
| GET | `/api/entrada/{id}` | Ver el detalle de una entrada |
| GET | `/api/usuarios` | Listar usuarios |
| PUT | `/api/usuario` | Actualizar el usuario (por ejemplo, cambiar de nivel) |

Un ejemplo rápido:

```bash
curl -X POST http://localhost:8080/api/entrada \
  -H "Content-Type: application/json" \
  -d '{"idUsuario":1,"texto":"yesterday i goed to the park and i eated a apple . it was beatiful"}'
```

Y te devuelve el texto corregido — *"Yesterday I went to the park and I ate an apple. It was beautiful."* — junto con la lista de errores explicados y el resumen de temas.

## Lo que quiero agregar más adelante

Tengo varias ideas para que crezca:

- Un apartado de **lecciones** sobre los temas donde más fallo (por ejemplo, los *infinitives*), para entenderlos y practicarlos.
- Un **historial de vocabulario**, para ver qué palabras nuevas voy usando con el tiempo, y que la app me **sugiera palabras** para ir subiendo de nivel poco a poco. Si ya estoy en avanzado, que no me sugiera palabras de principiante.
- Un **módulo para practicar exámenes** tipo Cambridge, con plantillas de cartas formales e informales, essays y artículos, porque a varios amigos se les complicó el *grammar* en esa parte.
- Soporte para **más idiomas**, cuentas de usuario y recordatorios para escribir cada día.

---

Hecho con cariño mientras aprendo inglés y programo a la vez. 🌱
