# Diario de día y de noche

Alcance: toda la aplicación conservando el orden funcional aprobado: editor, historial, correcciones, progreso, acceso y portada.
Modos: Operate en la aplicación; Persuade en portada; Read en La idea.

## Direction contract
THESIS: Un diario personal ilustrado donde contar lo vivido y entender pequeños cambios del inglés.
OWN-WORLD: Referencias visuales adjuntas por la usuaria el 24 de octubre: papel crema y salvia de día, azul noche con lavanda y luz cálida de noche. Ilustraciones de escritura, corrección y recuerdos. Serif en títulos, Inter legible en editor y controles. La elección explícita de la usuaria prevalece sobre el concept-seed c4ec4466; no introducir las direcciones ajenas del catálogo. Del prompt se toma suavidad, no vídeos ni una agencia de cristal negro.
STORY: Desahogarse, aprender de los errores y volver al historial. Corrector limitado, sin prometer IA contextual, nivel automático ni puntuar por falta de punto final.
FIRST VIEWPORT: Portada con mensaje centrado y acciones; a continuación tres escenas ilustradas a la izquierda y un ejemplo realista de corrección a la derecha. En móvil, escenas en filas y ejemplo debajo. El editor conserva su campo amplio de 20px/18px y el orden existente.
SIGNATURE: El cambio de claro a oscuro transforma también la ventana diurna en luna y las paletas de las ilustraciones. En primera visita seguir el dispositivo, confirmado por la usuaria; después recordar su elección manual. Cambios del sistema se siguen mientras no exista elección manual.
FORM: Implementación desde código. La usuaria exigió respetar sus seis iconos ilustrados: se preparó su hoja de referencia con image_gen para separar fondo y etiquetas, conservando escenas y estilo, y se codificó como sprite WebP con alpha (224658 bytes). No sustituirlos por SVG simplificados. El mockup aportado guía el ambiente, no se incrusta como captura de página. Seed c4ec4466 queda subordinado a esta dirección explícita de la usuaria.
MOTION: Titular650ms, apertura sutil de tarjeta750ms y aparición del cambio700ms. Estrellas con dos destellos finitos, total máximo4.5s; ningún bucle infinito. Movimiento reducido conserva contenido estático. Hover con desplazamiento solo para puntero preciso. Sin animar texto editable, sin parallax ni vídeo pesado.
FINISH: Revisión independiente del código y capturas de ambos temas en escritorio y móvil; documentar tokens en DESIGN.md y su sidecar.

## Evidence
- 18 pruebas aprobadas, incluida preferencia del sistema, cambio manual persistente y carrera de autenticación.
- TypeScript y Vite compilan. La API, cuentas y persistencia no cambian en esta iteración.
- Detector mecánico ejecutado una vez: solo avisos por familias Instrument Serif e Inter; se conservan por continuidad, referencia explícita y legibilidad del editor.

## Ajuste confirmado el 25 de octubre
La usuaria mantiene el diseño y exige sus iconos originales y un degradado parecido al segundo mockup. Centro #151E2E, viñeta #101724, tarjeta #1B2537, barra y banner #131B29. Halo lavanda discreto junto a la tarjeta, estrellas puntuales, borde fino iluminado. La superficie de escritura sigue sólida para leer sin ruido. Inspiración de MotionSites consultada; se adapta movimiento CSS sin copiar páginas ni instalar paquetes.

## Cierre de revisión
Revisión independiente del ajuste nocturno: disposition ship tras aclarar que #131B29 corresponde a la barra inferior de la tarjeta y al banner, no al encabezado público. Capturas actuales de portada en 1440px y 390px, ambos temas. Las otras pantallas se comprobaron en la pasada anterior; sus capturas no certifican los últimos cambios cromáticos. Contraste mínimo entre los pares de texto principales comprobados: claro5.44:1, oscuro7.20:1. Sprite WebP con alpha224658bytes; provenance sidecar presente, escaneo1raster/0faltantes. BuildTypeScript/Vite y18tests aprobados.
