# Validación de esta entrega

Verificado el 20 de octubre de 2026 con JDK 21 y Maven:

- Compilación de las 35 clases e interfaces Java de producción: correcta.
- `CorrectorTest`: 4 pruebas, sin fallos.
- `ApiIntegracionTest`: 3 pruebas, sin fallos; cada prueba HTTP cubre varias operaciones.
- Total: 7 pruebas, 0 fallos, 0 errores.

La integración arrancó Spring Boot 4.0.8 con Tomcat y una conexión Hikari a `jdbc:h2:mem:diario`. Las peticiones recorrieron controladores, implementaciones de servicio, repositorios JPA y H2.

Cobertura funcional comprobada: crear perfil y entrada, corregir, sugerir vocabulario, conservar nivel histórico, consultar historial, ejecutar reporte JPQL, editar retirando correcciones antiguas, borrar, rechazar datos inválidos y emails duplicados, proteger el borrado de perfiles con entradas, acceder a OpenAPI/Swagger y responder al preflight CORS del origen Angular.

El primer intento en el entorno restringido pasó las reglas, pero no pudo abrir una conexión loopback. La ejecución autorizada con permisos para un servidor local pasó las siete pruebas. Esta restricción del entorno no requirió modificar el código para saltarse las pruebas.

## Verificacion local del 21 de octubre de 2026

- `mvnw.cmd clean verify` y verificacion posterior a la configuracion: BUILD SUCCESS, 7 pruebas sin fallos.
- Arranque del JAR con Java 21, sin perfil H2, conectado a PostgreSQL 18.6 en `localhost:5432/db_diario_idiomas`.
- Configuracion privada en `application-local.properties`, cargada desde la carpeta del proyecto y excluida de Git.
- Creacion de un perfil temporal y una entrada por HTTP; lectura directa con `psql` que confirmo el texto corregido y dos correcciones persistidas en PostgreSQL.
- Historial, resumen JPQL, Swagger y OpenAPI: HTTP 200.
- Borrado por HTTP de la entrada y el perfil temporales al terminar la verificacion.

No comprobado: ejecución del frontend Angular, autenticación ni autorización multiusuario. Las rutas y campos originales que consume Angular se mantienen, pero eso no equivale a una prueba del navegador.
