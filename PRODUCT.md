# Diario de Idiomas

## Platform

Web, con una aplicación conectada y una demo local separada.

## Stack

Frontend React, Vite, TypeScript y Tailwind CSS. Backend Java 21 y Spring Boot 4.0.8, Spring Data JPA, Spring Security y PostgreSQL. La aplicación conectada está publicada en Render y utiliza Neon. Instrument Serif e Inter Variable se sirven con el frontend.

## Users

Personas que estudian inglés y quieren practicar escribiendo sobre su día y revisar cambios explicados. El nivel A1–C2 se elige por autoevaluación para orientar preguntas y explicaciones; no se deduce del puntaje.

## Product Purpose

Unir el hábito personal de escribir un diario con la práctica del inglés. Escribir, corregir y guardar; volver al historial para releer y observar cambios con el tiempo. La motivación personal se conserva en la sección «Por qué lo hice» del README.

## Capabilities and Constraints

- Cuentas privadas con registro, inicio y cierre de sesión, contraseñas con BCrypt, sesiones HttpOnly y protección CSRF. La API comprueba la propiedad de perfiles y entradas; `/api/usuarios` no ofrece una lista pública.
- Crear, editar, eliminar y buscar entradas; filtrar por nivel, exportar historial como JSON y consultar categorías y puntajes de las últimas entradas.
- Guardado de entradas en Neon para acceder desde distintos dispositivos con la misma cuenta. Los borradores permanecen por cuenta en el navegador hasta guardar; no se sincronizan como borradores.
- Corrector basado en reglas limitadas, sin corrección contextual con IA. El puntaje es orientativo y no mide ni certifica dominio MCER. No se exige ni penaliza la falta de punto final.
- Correcciones inline seleccionables y explicación enfocada cuando sus posiciones son inequívocas. Se conserva el resultado real si no es posible localizar un cambio con seguridad.
- Formulario de acceso disponible durante la comprobación de sesión en segundo plano. Esa comprobación se cancela al comenzar el acceso y tiene un timeout de 15 segundos. Una petición de acceso prolongada muestra un aviso tras 4 segundos; esto no elimina la espera de arranque del servidor gratuito.
- La demo de GitHub Pages guarda datos y corrige localmente. No comparte cuentas, entradas ni almacenamiento cloud con la versión de Render.
- Los workflows n8n están preparados localmente para métricas agregadas y no están habilitados en cloud. Publicar los JSON no los activa. No enviar textos personales, mensajes ni correos desde esos flujos.
- Mantener herramientas y despliegues gratuitos. Nunca guardar secretos o credenciales en Git.

## Visual commitments

Dirección aprobada: un cuaderno personal legible. Instrument Serif en títulos y marca, Inter Variable en escritura y controles, fondo blanco cálido, tinta y oliva discreto; tema oscuro opcional. Acciones principales oscuras en claro, radios mínimos de 3px e historial en filas planas. Navegación lateral en escritorio, cabecera compacta en móvil, editor de 20px/18px y resaltado de cambios con explicaciones. La portada muestra el producto sin vídeo. El contrato de superficie está en `.impeccable/surfaces/diario-redesign.md`; los tokens actuales se documentan en DESIGN.md.

## Publication and evidence

URL principal: [Diario de Idiomas](https://diario-idiomas.vercel.app). Vercel Hobby sirve el frontend estático; Render Free mantiene la API y Neon conserva las entradas. El dominio anterior de Render también sigue sirviendo la aplicación. Los commits de main despliegan automáticamente el frontend mediante la integración GitHub, autorizada exclusivamente para cathv-24/diario_idioma.

`vercel.json` reenvía `/api` a Render bajo el mismo origen. `FRONTEND_ORIGIN` permite exactamente https://diario-idiomas.vercel.app y https://diario-idiomas.onrender.com. La sesión Secure/HttpOnly/SameSite=Lax y la protección CSRF se conservan; las credenciales de Neon permanecen en Render.

El formulario aparece sin esperar la comprobación de sesión en segundo plano. Esa comprobación se cancela al iniciar un acceso nuevo y tiene un límite de 15 segundos. La API gratuita aún puede tardar al despertar; separar el frontend no elimina ese arranque en frío.

Validación: 17 pruebas actuales de frontend; 12 pruebas previas de backend con Tomcat/H2; registro, inicio de sesión, guardado y recuperación real del historial desde Vercel hasta Neon. Las pruebas H2 por sí solas no prueban persistencia en PostgreSQL. La revisión independiente aprobó la fusión local y los cambios de arranque; la comprobación de publicación se documenta aparte.
