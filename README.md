# 📖 Diario de Idiomas

Un diario digital donde escribes tu día **en inglés** y la app te corrige la gramática
**según tu nivel** (A1–C2), te explica cada error y te muestra **en qué temas estás fallando**.
Aprendes mientras redactas tu día.

> Por ahora solo inglés. La arquitectura está pensada para añadir más idiomas después.

---

## 🧱 Arquitectura

Mismo estilo en capas que tu plantilla `apiproveedores` del curso de Arquitectura Web.

```
proyecto_diario_idiomas/
├── backend/apidiario/        → API REST (Spring Boot 4, Java 21, PostgreSQL)
│   └── src/main/java/com/diario/apidiario/
│       ├── entidades/        → Usuario, EntradaDiario, Correccion  (JPA + Lombok)
│       ├── enums/            → NivelIngles, CategoriaError
│       ├── dto/              → objetos de transferencia
│       ├── repositorios/     → JpaRepository + query methods + JPQL
│       ├── servicios/        → lógica de negocio (ModelMapper entidad↔DTO)
│       │   └── correccion/   → MOTOR HÍBRIDO de corrección
│       ├── controladores/    → endpoints REST (@RestController)
│       └── config/           → ModelMapper, CORS, OpenAPI, carga inicial, errores
│
└── frontend/                 → App Angular 18 (standalone) + Tailwind CSS
    └── src/app/
        ├── modelos/          → interfaces que reflejan los DTO
        ├── servicios/        → cliente HTTP + estado del usuario (signals)
        ├── componentes/      → resultado de corrección (reutilizable)
        └── paginas/          → escribir · historial
```

### Motor de corrección híbrido

La corrección vive detrás de la interfaz `ServicioCorreccion`, así que se puede
cambiar la implementación sin tocar el resto de la app:

| Implementación            | Cuándo se usa                              | Qué hace |
|---------------------------|--------------------------------------------|----------|
| `CorrectorBasadoEnReglas` | `diario.corrector=reglas` (por defecto)    | Reglas + diccionarios: ortografía, verbos irregulares, contracciones, `a/an`, mayúsculas, puntuación. **Funciona sin internet ni API key.** |
| `CorrectorLLM`            | `diario.corrector=llm` + `diario.llm.api-key` | Le pide las correcciones a Claude (Anthropic API). Si falla o no hay key, **cae de vuelta a las reglas**. |

Este es el enfoque que elegiste: **empezar con reglas y dejar el hueco listo para el LLM.**

---

## ▶️ Cómo ejecutarlo

### Requisitos
- Java 21, PostgreSQL, Node.js 18+.

### 1) Base de datos
Crea la base de datos (Hibernate crea las tablas solo con `ddl-auto=update`):
```sql
CREATE DATABASE db_diario_idiomas;
```
Ajusta usuario/contraseña en `backend/apidiario/src/main/resources/application.properties`
si los tuyos son distintos (por defecto `postgres` / `postgre`).

### 2) Backend (puerto 8080)
```bash
cd backend/apidiario
./mvnw spring-boot:run
```
Al arrancar crea un **usuario demo** (nivel A2) para probar de inmediato.
Documentación de la API (Swagger): http://localhost:8080/swagger-ui.html

### 3) Frontend (puerto 4200)
```bash
cd frontend
npm install
npm start
```
Abre http://localhost:4200 → escribe tu día → **Corregir mi día**.
Cambia tu nivel desde el selector de la cabecera (arriba a la derecha).

---

## 🔌 Activar el LLM (Claude) más adelante

En `application.properties`:
```properties
diario.corrector=llm
diario.llm.api-key=TU_API_KEY
diario.llm.model=claude-sonnet-5
```
No hay que cambiar código: el resto de la app sigue igual.

---

## 🌐 Endpoints principales

| Método | Ruta                       | Descripción |
|--------|----------------------------|-------------|
| POST   | `/api/entrada`             | Escribir una entrada y recibir la corrección |
| GET    | `/api/entradas/{idUsuario}`| Historial de entradas de un usuario |
| GET    | `/api/entrada/{id}`        | Detalle de una entrada |
| GET    | `/api/usuarios`            | Listar usuarios |
| PUT    | `/api/usuario`             | Actualizar usuario (p. ej. cambiar nivel) |

### Ejemplo
```bash
curl -X POST http://localhost:8080/api/entrada \
  -H "Content-Type: application/json" \
  -d '{"idUsuario":1,"texto":"yesterday i goed to the park and i eated a apple . it was beatiful"}'
```
Devuelve el texto corregido *("Yesterday I went to the park and I ate an apple. It was beautiful.")*,
la lista de correcciones con su explicación y el resumen de temas a mejorar.

---

## 🚀 Ideas para seguir creciendo
- Más idiomas (el `NivelIngles` y el motor ya están desacoplados para generalizar).
- Autenticación real (Spring Security) — encaja con el temario de tu curso.
- Gráfica de progreso del puntaje en el tiempo (ya existe `promedioPuntajePorUsuario`).
- Racha diaria y recordatorios para escribir cada día.
