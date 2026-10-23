# Diario de idiomas: backend de aprendizaje

API local en Java 21 y Spring Boot 4.0.8, siguiendo la organización del proyecto de proveedores de clase. Este es el backend actual del repositorio, ubicado en `backend/apidiario`.

## Abrir y ejecutar

Abre esta carpeta como proyecto Maven en IntelliJ. Selecciona JDK 21. Para practicar sin instalar una base de datos, ejecuta desde la terminal de esta carpeta:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```

Si la terminal no encuentra Java 21, establece JAVA_HOME para esa terminal antes del comando anterior. También puedes ejecutar `ApidiarioApplication` desde IntelliJ con el perfil activo `h2`.

- Swagger: http://localhost:8080/swagger-ui/index.html
- Descripción OpenAPI: http://localhost:8080/v3/api-docs
- Perfil de demostración: consulta `GET /api/usuarios` para conocer su identificador. No presupongas que será siempre 1.
- Con H2, los datos desaparecen al detener el servidor.
- El servidor se vincula a `127.0.0.1`: esta etapa se usa en tu equipo.

## PostgreSQL

Primero crea una base vacía llamada `db_diario_idiomas`, desde pgAdmin o SQL. Se recomienda una base independiente para esta versión, porque las tablas difieren de las del backend anterior. Elimina el perfil `h2` y configura en la terminal:

```powershell
$env:DB_URL='jdbc:postgresql://localhost:5432/db_diario_idiomas'
$env:DB_USERNAME='postgres'
$env:DB_PASSWORD='TU_CONTRASENA_LOCAL'
.\mvnw.cmd spring-boot:run
```

`TU_CONTRASENA_LOCAL` es un marcador que debes sustituir en tu terminal; no guardes la contraseña real en Git. Las pruebas automatizadas usan H2.

Para conservar la configuracion entre arranques, copia `application-local.properties.example` como `application-local.properties` en la raiz de esta carpeta y completa tu contraseña. Spring Boot lo carga automaticamente al arrancar desde esta carpeta, incluido Maven. El archivo real esta excluido de Git. En IntelliJ, configura el directorio de trabajo de `ApidiarioApplication` como esta carpeta y deja vacios los perfiles activos para usar PostgreSQL.

Si aparece `password authentication failed`, PostgreSQL esta respondiendo pero rechazo las credenciales. Si aparece `database ... does not exist`, crea la base indicada. El perfil `h2` usa una base en memoria y no verifica la conexion a PostgreSQL.

## Leer y aprender

1. [Guía paso a paso](docs/GUIA_PASO_A_PASO.md): arquitectura, dependencias, todas las funciones, flujo completo y práctica en Swagger.
2. [Primera lectura línea por línea](docs/PRIMERA_LECTURA.md): arranque, entidad, interfaz y controlador.
3. [Endpoints y ejemplos](docs/ENDPOINTS.md): método, ruta, responsabilidad y JSON de prueba.

## Qué incluye

- Crear, listar, consultar, actualizar y eliminar perfiles.
- Corregir y guardar entradas; consultar, editar y eliminar entradas.
- Conservar el nivel utilizado en cada corrección.
- Historial y reporte de errores por categoría mediante JPQL.
- Correcciones limitadas por reglas y dos sugerencias opcionales de vocabulario.
- Validación de datos, errores HTTP diferenciados y documentación Swagger.
- Pruebas unitarias y pruebas HTTP reales con Tomcat y H2.

Las reglas corrigen `goed`, `eated`, `buyed`, `recieve`, `beatiful`, `informations`, `dont`, el pronombre `i`, la inicial del texto y el signo final. No analizan toda la gramática ni comprenden el contexto. No cambian `were` ni `everyday`. El nivel cambia el idioma de explicación y qué sugerencias opcionales se muestran; no hace un diagnóstico MCER del texto. Los umbrales de vocabulario son decisiones educativas de la aplicación, no certificaciones del nivel de cada palabra.

El puntaje es `max(0, 100 - 5 × correcciones detectadas)`; es orientativo y no mide dominio del inglés. Las sugerencias no descuentan puntos ni modifican automáticamente el texto. Se calculan al consultar la entrada; si las reglas de sugerencias cambian en el futuro, pueden cambiar las sugerencias mostradas para entradas antiguas. Las correcciones sí se guardan.

## Alcance de seguridad

Esta etapa enseña el flujo antes del login. Un perfil no es una cuenta autenticada. Los identificadores no demuestran identidad, y CORS no es autenticación. Antes de alojar esta API para otros usuarios, la siguiente etapa debe incorporar Spring Security, BCrypt, JWT y comprobaciones de propiedad en todas las operaciones del diario. No guarda contraseñas ni pretende ofrecer todavía un diario privado para varias personas.

## Frontend existente

Se conservan los campos principales de los DTO y las rutas `/api/usuarios`, `/api/usuario`, `/api/entrada` y `/api/entradas/{idUsuario}`. El frontend actual usa React, Vite y TypeScript y consume estos contratos. CORS acepta por defecto `http://localhost:5173` y `http://127.0.0.1:5173`; `FRONTEND_ORIGIN` permite una lista separada por comas.

El perfil optativo `neon` toma `NEON_JDBC_URL`, `NEON_DB_USERNAME` y `NEON_DB_PASSWORD` del entorno. El envio de metricas a n8n esta desactivado hasta configurar `N8N_ENABLED=true`, `N8N_WEBHOOK_URL` y `N8N_WEBHOOK_TOKEN`. Consultar [automatizaciones y configuracion](../../automations/README.md) para workflows, esquema SQL y limites de entrega.

## Pruebas

```powershell
.\mvnw.cmd test
```

Las pruebas HTTP necesitan permiso para abrir un puerto temporal local. No usan la base PostgreSQL real ni llaman a proveedores de IA.
