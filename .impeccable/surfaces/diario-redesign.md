# Diario de día y de noche

Alcance: toda la aplicación conservando el orden funcional aprobado: editor, historial, correcciones, progreso, acceso y portada.
Modos: Operate en la aplicación; Persuade en portada; Read en La idea.

## Direction contract
THESIS: Un diario personal ilustrado donde contar lo vivido y entender pequeños cambios del inglés.
OWN-WORLD: Referencias visuales adjuntas por la usuaria el 24 de octubre: papel crema y salvia de día, azul noche con lavanda y luz cálida de noche. Ilustraciones de escritura, corrección y recuerdos. Serif en títulos, Inter legible en editor y controles. La elección explícita de la usuaria prevalece sobre el concept-seed c4ec4466; no introducir las direcciones ajenas del catálogo. Del prompt se toma suavidad, no vídeos ni una agencia de cristal negro.
STORY: Desahogarse, aprender de los errores y volver al historial. Corrector limitado, sin prometer IA contextual, nivel automático ni puntuar por falta de punto final.
FIRST VIEWPORT: Portada con mensaje centrado y acciones; a continuación tres escenas ilustradas a la izquierda y un ejemplo realista de corrección a la derecha. En móvil, escenas en filas y ejemplo debajo. El editor conserva su campo amplio de 20px/18px y el orden existente.
SIGNATURE: El cambio de claro a oscuro transforma también la ventana diurna en luna y las paletas de las ilustraciones. Un degradado cálido visible y estrellas doradas cubren todas las vistas claras; el cielo degradado con estrellas cubre todas las oscuras. El cierre de la portada clara deja el fondo al descubierto y el editor nocturno es sólido. En primera visita seguir el dispositivo, confirmado por la usuaria; después recordar su elección manual. Cambios del sistema se siguen mientras no exista elección manual.
FORM: Implementación desde código. La usuaria exigió respetar sus seis iconos ilustrados: se preparó su hoja de referencia con image_gen para separar fondo y etiquetas, conservando escenas y estilo, y se codificó como sprite WebP con alpha (224658 bytes). No sustituirlos por SVG simplificados. El mockup aportado guía el ambiente, no se incrusta como captura de página. Seed c4ec4466 queda subordinado a esta dirección explícita de la usuaria.
MOTION: Titular650ms, apertura sutil de tarjeta750ms y aparición del cambio700ms. Estrellas con dos destellos finitos, total máximo4.5s; ningún bucle infinito. Movimiento reducido conserva contenido estático. Hover con desplazamiento solo para puntero preciso. Sin animar texto editable, sin parallax ni vídeo pesado.
FINISH: Revisión independiente del código y capturas de ambos temas en escritorio y móvil; documentar tokens en DESIGN.md y su sidecar.

## Evidence
- 18 pruebas aprobadas, incluida preferencia del sistema, cambio manual persistente y carrera de autenticación.
- TypeScript y Vite compilan. La API, cuentas y persistencia no cambian en esta iteración.
- Detector mecánico ejecutado una vez: solo avisos por familias Instrument Serif e Inter; se conservan por continuidad, referencia explícita y legibilidad del editor.

## Ajuste confirmado el 25 de octubre
La usuaria mantiene el diseño y exige sus iconos originales y un degradado parecido al segundo mockup. Centro #151E2E, viñeta #101724, tarjeta #1B2537, barra y banner #131B29. Halo lavanda discreto junto a la tarjeta, estrellas puntuales, borde fino iluminado. El cielo degradado y las estrellas se extienden a editor, historial, progreso y acceso; la superficie de escritura sigue sólida para leer sin ruido. En claro, un degradado crema cálido visible cubre todas las pantallas, con estrellas doradas en lugar de nubes vectoriales. El cierre de la portada ya no tiene fondo propio. Inspiración de MotionSites consultada; se adapta movimiento CSS sin copiar páginas ni instalar paquetes.

## Cierre de revisión
Revisión independiente del ajuste anterior: disposition ship, sin defectos materiales. Capturas locales de esa revisión: `landing-light.png`, `landing-dark.png`, `desktop.png`, `mobile.png`, `history-dark.png`, `auth-real-dark.png` y `auth-real-light.png` en `.impeccable/review/`. La revisión actual confirmó visualmente estrellas en la portada clara, cierre sin tarjeta y degradado en acceso, editor, historial, progreso y «La idea»; el build TypeScript/Vite y 19 pruebas del frontend pasaron. `Landing.tsx` aporta los puntos y estrellas de portada; `App.tsx` añade las estrellas a las vistas internas; `journal.css` aplica degradados por tema y mantiene el editor oscuro sólido. `AuthPanel.tsx` exige ocho caracteres al registrarse; `AuthController.java` valida ese mínimo en el servidor. Las capturas y la inspección local no certifican por sí solas un despliegue nuevo. Sprite WebP con alpha de 224658 bytes; procedencia registrada.
