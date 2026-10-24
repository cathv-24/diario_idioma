# Diario de Idiomas

## Platform
web

## Stack
React, Vite, TypeScript y Tailwind CSS, solicitados el 23 de octubre de 2026 para sustituir el frontend Angular. API Spring Boot existente y PostgreSQL; integración solicitada con Neon y n8n.

## Users
Personas que estudian inglés A1–C2 y quieren escribir sobre su día y aprender de correcciones explicadas.

## Product Purpose
Unir el hábito personal de escribir un diario con la práctica del inglés. Escribir, corregir y guardar; volver al historial para observar cambios con el tiempo.

## Capabilities and Constraints
El motor existente aplica reglas limitadas, no una corrección contextual con IA. API de perfiles, entradas, edición, eliminación, historial y resumen. Modo demo local con almacenamiento en navegador. No inventar estadísticas ni presentar un puntaje como nivel MCER. Proteger borradores ante errores. El backend todavía no tiene autenticación multiusuario. La conexión real a Neon y la activación de n8n dependen de accesos del usuario, pendientes de confirmar. No enviar mensajes ni correos desde automatizaciones. Nunca guardar secretos en Git ni atribuciones de IA en commits.

## Visual commitments
La usuaria proporcionó una dirección concreta: blanco, negro, gris #6F6F6F, Instrument Serif e Inter, portada cinematográfica con vídeo proporcionado y fundidos de 0,5 segundos. Adaptar textos al diario en español. Imagen generada solo si es necesaria.

La versión conectada admite cuentas privadas y acceso entre dispositivos. Los borradores permanecen por cuenta en el navegador; las entradas guardadas se sincronizan con Neon. GitHub Pages es una demo separada.
