# Despliegue público verificado — 23 de octubre de 2026

Aplicación: https://diario-idiomas.onrender.com/#escribir

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
