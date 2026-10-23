# Automatizaciones del Diario de Idiomas

Estado local verificado el 23 de octubre de 2026: n8n 2.44.6 instalado en el equipo y
Neon conectado con TLS y verificacion de certificado. Ambos workflows se importaron y
publicaron en esa instancia. Los JSON versionados siguen inactivos y sin credenciales,
para que una nueva importacion no active tareas por accidente. No se envia correo.

## Que incluye

1. `n8n/01_entry_metrics.json`: webhook POST autenticado por cabecera, valida un contrato
   estricto y registra metricas en Neon mediante parametros SQL. El UUID evita duplicados
   cuando se reintenta la entrega. La respuesta HTTP solo confirma despues de guardar.
2. `n8n/02_weekly_report.json`: ejecucion manual o lunes a las 08:00 (America/Lima),
   calcula la semana anterior completa y guarda un agregado global en Neon. La programacion
   solo funciona despues de activar/publicar el workflow. Es un informe de actividad del
   motor de reglas; no acredita dominio del ingles ni progreso individual.
3. Perfil Spring `neon`: PostgreSQL remoto con JDBC, TLS y pool acotado. Guarda las entradas
   completas en Neon si se activa. Las credenciales nunca deben llegar al frontend.

## Configuracion de Neon

Crear o seleccionar un proyecto y rama en la consola de Neon; en **Connect** copiar host,
base, rol y contrasena. Usar un proyecto/branch de desarrollo para la primera prueba.
La URL de Spring es JDBC (`jdbc:postgresql://HOST/BASE?sslmode=verify-full&sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory`), no la URL
`postgresql://usuario:password@host/base` que algunas librerias JavaScript utilizan.
La fabrica SSL indicada usa las raices de confianza de Java y conserva la verificacion
del certificado/hostname; evita depender de un `root.crt` local ausente en Windows.
Ejecutar `sql/001_automation_schema.sql` en Neon SQL Editor.

Tomar las variables de `.env.example` y definirlas en el proceso que lanza Spring.
Spring no lee automaticamente un archivo `.env`. Al ejecutar desde `backend/apidiario`:

```powershell
$env:SPRING_PROFILES_ACTIVE = 'neon'
# Definir NEON_JDBC_URL, NEON_DB_USERNAME y NEON_DB_PASSWORD de forma privada.
.\mvnw.cmd spring-boot:run
```

JPA usa `ddl-auto=update` del proyecto para crear/actualizar las tablas de la API.
Esto no migra los datos del PostgreSQL local. La API conserva su enlace local 127.0.0.1;
no se publica en Internet mientras no exista autenticacion/autorizacion de diarios.

## Configuracion de n8n

Usar una instancia propia de n8n o una ya existente. No se ha contratado ningun servicio.
El runtime local se instala fuera del repositorio, en
`C:\Users\ASUS\Documents\ChatGPT\personal\.runtime-diario-n8n`.
`automations/start-local-n8n.ps1` lo inicia como proceso oculto en `127.0.0.1:5678`, con
base interna y credenciales en el runtime privado. La instancia solo existe mientras el
equipo y proceso estan encendidos; no es un servicio alojado 24/7. El script rechaza
iniciar una segunda instancia si ese puerto esta ocupado. El propietario se configura
desde la pantalla inicial de n8n. En el equipo actual se creo un propietario local;
sus datos estan en `owner-account-private.json` del runtime, fuera de Git. No se
incluyen datos de acceso en el repositorio.

Importar cada JSON con **Import from File**. Crear la credencial **Postgres** con los datos
de Neon, puerto 5432 y SSL habilitado con validacion del certificado. No activar
`Ignore SSL Issues`. Seleccionar esa credencial en cada nodo Postgres.

Crear una credencial **Header Auth** con nombre `X-Diario-Token` y un valor secreto
aleatorio largo. Asignarla al nodo Webhook. Ese mismo valor se configura en
`N8N_WEBHOOK_TOKEN` del backend. No escribir el secreto en los JSON ni en Git.

Para probar, en n8n seleccionar **Listen for test event**, usar su URL `/webhook-test/`
en `N8N_WEBHOOK_URL` y habilitar `N8N_ENABLED=true` en Spring. Crear una entrada desde
la API/frontend. Verificar una fila en `diary_automation.entry_events`; repetir el mismo
evento debe devolver `accepted=true, inserted=false`, sin fila duplicada. Una cabecera
incorrecta debe ser rechazada por n8n. Un payload incorrecto debe fallar antes de SQL.
Despues publicar/activar solo el primer workflow y cambiar a la URL `/webhook/` de produccion.
Ejecutar manualmente el segundo y verificar `diary_automation.weekly_reports`; activarlo
solo cuando se desee la ejecucion semanal. La semana sin entradas produce ceros.

## Contrato y limites

El backend publica `entry.created` **solo al crear**, despues de confirmar la transaccion.
No publica ediciones/borrados: el ledger mide la actividad de creacion, no una replica del
estado actual del diario. Contiene UUID, fecha, id de entrada pseudonimo, nivel, cantidad
de palabras/correcciones y puntaje del corrector. Excluye texto, fragmentos, explicaciones,
nombre, correo e id de usuario. Mantener el ledger privado; sus IDs se pueden correlacionar
con la API si se dispone de acceso a ambas bases.

El envio ocurre en un pool separado, con timeout de 4 s, hasta 3 intentos para fallos de
red/5xx/429 y cola limitada. Si n8n falla, la entrada sigue guardada. No hay outbox durable:
un reinicio o cola llena puede perder eventos; revisar logs y no usar este ledger para
contabilidad o sincronizacion critica. El UUID asegura idempotencia de los reintentos,
no recuperacion garantizada. El agregado describe solo los eventos recibidos.

## Verificacion local

`mvnw.cmd test` incluye el flujo API/JPA original y pruebas de metadatos, commit/rollback,
cabecera, reintento idempotente y fallo externo con un servidor HTTP local. Ejecutar
`node automations/validate-workflows.mjs` desde la raiz valida los grafos y el codigo de
validacion de los JSON. Se puede pasar como argumento la ruta del runtime de n8n para
validar tambien los parametros con sus esquemas Zod oficiales instalados.

La prueba real en esta instancia confirmo: cabecera incorrecta rechazada con 403,
evento correcto aceptado con 200, repeticion del UUID sin duplicar filas y ejecucion
manual del reporte semanal en Neon con estado `success`. Se elimino la fila sintetica
de prueba del ledger. El reporte de la semana completa anterior sin eventos devuelve
conteos en cero y promedio nulo, sin atribuir un puntaje inventado. La programacion
local quedo publicada para los lunes 08:00 America/Lima; requiere equipo y n8n encendidos.

## Referencias oficiales

- [n8n Webhook y autenticacion](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Postgres y parametros de consulta](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/)
- [n8n Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/)
- [Neon y Java/JDBC](https://neon.com/docs/guides/java)
- [Eventos ligados a transacciones en Spring](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html)
