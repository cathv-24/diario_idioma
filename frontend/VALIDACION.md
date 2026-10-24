# Validación del frontend — 23 de octubre de 2026

## Alcance

React + Vite + TypeScript + Tailwind sustituyen a Angular por solicitud explícita. Se mantiene la API Spring Boot. GitHub Pages funciona en demo local; no se publica una API sin autenticación.

## Comprobaciones

- Compilación TypeScript y Vite correcta.
- 9 pruebas del corrector: texto original, corrección, idiomas por nivel, palabras ambiguas, agregación y límite del puntaje.
- Navegador en modo demo: crear perfil, corregir y guardar, editar, recuperar el historial al recargar y búsqueda sin coincidencias.
- Revisión visual en 1280×900 y 390×844: portada y editor, sin desbordamiento horizontal observado.
- Correcciones de revisión: tamaño del texto explicativo, contraste del placeholder, foco visible y recuperación del borrador con fecha e identificador de edición.
- La fuente y el vídeo se sirven desde los proveedores indicados en el diseño; existe un fondo de reserva si el vídeo falla.

Los datos usados para verificación son sintéticos. El corrector es limitado y el puntaje no representa nivel MCER. La comparación temporal no controla longitud ni dificultad del texto.

## Ejecución

`npm ci`, `npm test`, `npm run build`. Desarrollo: `npm run dev`. Demo local del build: `npm run preview`.

- Regresión: cierres sin signo, con puntos suspensivos, exclamación y emoji conservados sin penalización.
- Guía A1–C2 y preguntas por nivel; revisión estática independiente aprobada.
- Vista móvil verificada: Inter de 17 px, borrador conservado y sin desbordamiento horizontal.

## Acceso desde distintos dispositivos

El build con VITE_API_URL=/api usa la cuenta del servidor. Las pruebas HTTP del backend utilizan clientes con cookies independientes: sincronización entre sesiones e imposibilidad de acceder a entradas ajenas. Las sesiones, contraseñas y CSRF no se almacenan en localStorage; los borradores usan claves por cuenta.
