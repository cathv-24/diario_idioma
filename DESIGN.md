---
name: Diario de Idiomas
description: Un diario personal ilustrado, de día y de noche, para escribir y entender pequeños cambios.
colors:
  background: "#f8f4e9"
  surface: "#fffdf7"
  soft: "#eeeade"
  ink: "#302d28"
  muted: "#686358"
  accent: "#536749"
  accent-hover: "#3e5136"
  line: "#dcd7c8"
  focus: "#647b55"
  mark: "#dce4d1"
  mark-ink: "#35492f"
  danger: "#b42332"
  danger-soft: "#fff0f0"
  nav: "#f8f4e9"
  action: "#536749"
  action-ink: "#fffdf7"
  art-ground: "#eee7d4"
  art-line: "#665044"
  art-paper: "#fff9e9"
  art-leaf: "#9cae8c"
  art-clay: "#c7937c"
  art-skin: "#e6bb98"
  art-hair: "#92694f"
  art-window: "#e5eadc"
  art-gold: "#c99b53"
  preview-bg: "#e8ecdf"
  dark-background: "#151e2e"
  dark-surface: "#1b2537"
  dark-soft: "#263147"
  dark-ink: "#f6eddf"
  dark-muted: "#c0c8d2"
  dark-accent: "#cbbfe6"
  dark-accent-hover: "#e3d5fa"
  dark-line: "#45546a"
  dark-focus: "#e4ca94"
  dark-mark: "#4d4868"
  dark-mark-ink: "#f0e7ff"
  dark-danger: "#ffacb4"
  dark-danger-soft: "#422c3c"
  dark-nav: "#131b29"
  dark-action: "#f0d49c"
  dark-action-ink: "#302a21"
  dark-art-ground: "#303e59"
  dark-art-line: "#202d43"
  dark-art-paper: "#aeb5d4"
  dark-art-leaf: "#7d9a97"
  dark-art-clay: "#8b7ea3"
  dark-art-skin: "#c4b4b6"
  dark-art-hair: "#4d526f"
  dark-art-window: "#1c2939"
  dark-art-gold: "#f0d49c"
  dark-preview-bg: "#131b29"
  night-vignette: "#101724"
  night-card-border: "#9e93bc"
  night-banner-border: "#46516a"
  night-action-hover: "#ffe4b3"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(43px, 4.1vw, 64px)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "29px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter Variable, sans-serif"
    fontWeight: 400
    lineHeight: 1.65
  editor:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.85
  editor-mobile:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.85
  button:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 550
    lineHeight: 1.5
rounded:
  field: "9px"
  button: "9px"
  paper: "10px"
  flat: "0"
  navigation: "8px"
  preview: "11px"
  night-banner: "16px"
  theme-toggle: "24px"
spacing:
  small: "8px"
  medium: "16px"
  section: "24px"
  desktop-inset: "40px"
  mobile-inset: "18px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "11px 19px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "11px 19px"
  editor:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.editor}"
    padding: "30px 30px 18px"
  navigation-active:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.navigation}"
  correction-mark:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.mark-ink}"
    padding: "0 2px"
  writing-prompt:
    backgroundColor: "transparent"
    rounded: "{rounded.flat}"
    padding: "20px 0"
  landing-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.preview}"
  night-banner:
    backgroundColor: "{colors.dark-nav}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.night-banner}"
---

# Design System: Diario de Idiomas

## Overview

**Creative North Star: "Diario de día y de noche"**

Un diario personal ilustrado donde contar lo vivido y entender pequeños cambios del inglés. Las referencias aportadas por la usuaria gobiernan el ambiente: papel crema y salvia durante el día; azul noche, lavanda y luz cálida de noche. Instrument Serif acompaña títulos y marca; Inter mantiene legibles la escritura y los controles.

El contrato aprobado está en `.impeccable/surfaces/diario-redesign.md`. Los tokens provienen de `frontend/src/styles/theme.css`, sus ajustes finales de `journal.css` y las fuentes de `fonts.css`. Se conserva el orden funcional del editor, historial, correcciones, progreso y acceso.

**Key Characteristics:**

- Escritura amplia, estable y explicaciones cercanas al cambio.
- Seis escenas ilustradas que cambian de paleta según el tema.
- Navegación lateral en escritorio, cabecera compacta en móvil e historial en filas.
- Atmósfera suave en todas las vistas: degradado cálido de día y cielo degradado con estrellas de noche; superficie sólida para escribir.

## Colors

### Primary

Salvia `accent` identifica enlaces, aprendizaje y acciones principales de día. El tema nocturno utiliza lavanda para enlaces y correcciones, y luz cálida para la acción principal; cada tema tiene su propio conjunto de tokens. El hover principal nocturno usa `night-action-hover`. El color acompaña etiquetas, estados y bordes.

### Neutral

El tema claro combina `background` crema, `surface` papel cálido y tinta marrón. Todas las vistas claras reciben un degradado radial cálido: en la base pasa por #fffdf5, `background` y #f2eddf; el contenido interno suma un halo dorado tenue. Solo la portada añade tres nubes lineales, doce puntos dorados y dos halos cálidos. Su banner final usa un degradado arena de #dbc29f a #d2b48d y #d9bc96.

En oscuro, el degradado radial de la base mantiene el centro `dark-background` (#151e2e) hasta el 38% y termina en `night-vignette` (#101724). El contenido de todas las vistas internas añade halos azul y lavanda y dieciocho estrellas decorativas detrás de las superficies. La portada tiene otras dieciocho estrellas propias y un halo lavanda junto al ejemplo. La tarjeta usa `dark-surface` (#1b2537). La barra inferior de la tarjeta de ejemplo, el pie del editor y el banner final usan `dark-nav` (#131b29). Esta barra es el pie de la tarjeta: la cabecera pública nocturna es transparente intencionalmente; la barra lateral del espacio de trabajo sí usa `dark-nav`.

El halo lavanda es discreto y queda detrás del ejemplo; el editor nocturno usa `dark-surface` sólido. `mark` y `mark-ink` distinguen los cambios; `danger` se reserva para errores y acciones destructivas. Las relaciones de contraste de texto se registran en el sidecar como pares calculados, sin equiparar esta medición a una auditoría completa de accesibilidad.

## Typography

Instrument Serif 400, normal e italic, se reserva para títulos, marca y preguntas. Inter Variable sirve para escritura, controles y explicaciones. Las fuentes se importan de Fontsource y se sirven con el frontend.

El titular de portada usa display; hasta 640px es de 42px, interlineado 1.12. El editor conserva Inter de 20px/18px con interlineado 1.85; el resultado usa 1.9. No reducir el diario para acomodar controles secundarios. La demostración de portada tiene su propia escala responsiva, distinta del editor real.

## Layout

La barra lateral fija del espacio de trabajo mide 224px; contenido y pie reservan ese margen. El contenido mantiene un máximo de 1360px; la navegación tiene máximo de 1320px. Hasta 880px, la navegación de trabajo se convierte en cabecera sticky y menú desplegable.

El editor conserva columna flexible y acompañante de 272px; el resultado tiene explicaciones de 310px. Se ajustan anchos en 1180px y se apilan paneles entre 881px y 1000px. Hasta 640px, el espacio de trabajo utiliza una columna con márgenes compactos. El historial conserva filas planas.

La portada centra titular y acciones. Debajo, tres escenas se sitúan a la izquierda y el ejemplo de corrección a la derecha (1.15fr / 1fr, separación 50px). En 1100px se ajustan a columnas iguales y 26px; hasta 880px se apilan. Hasta 640px, cada escena es una fila con ilustración de 108px y texto, seguida por el ejemplo.

**The Whole-Journal Sky Rule.** El degradado pertenece también a historial, progreso, acceso y editor; las estrellas del modo oscuro van detrás del contenido, nunca sobre el texto editable. En claro, las nubes pertenecen solo a la portada.

## Elevation & Depth

El papel y las superficies seleccionadas usan sombra ambiental: claro `0 12px 36px rgb(79 67 43 / 7%)`; oscuro `0 16px 40px rgb(8 15 27 / 22%)`. El ejemplo nocturno añade borde fino #9e93bc y `0 9px 32px rgb(9 13 23 / 40%), 0 0 24px rgb(147 125 190 / 9%)`. Un halo radial lavanda `rgb(96 74 138 / 15%)` acompaña la tarjeta sin cubrir el texto. Las estrellas se ven en la portada y detrás de las vistas internas; el editor es un plano sólido encima de ellas.

## Shapes

Botones y campos usan 9px; navegación de trabajo 8px; papel de editor y resultado 10px; ejemplo 11px; banner nocturno 16px; selector de tema 24px. Las correcciones inline conservan 3px. El historial permanece en filas sin tarjetas. El halo del ejemplo diurno tiene esquinas suaves de 26px; en oscuro se retira para dejar visible el cielo.

## Components

- **Editor:** fecha, contador y borrador acompañan el campo amplio. Guardar muestra carga y un fallo conserva el texto. No se exige punto final. Barra superior e inferior mezclan `soft` al 45% con `surface`; el pie nocturno utiliza #131b29.
- **Correcciones:** los fragmentos inequívocamente localizables son botones resaltados que enfocan su explicación. Si un rango no reproduce el texto, se conserva el resultado real sin resaltar una palabra equivocada. Original/Corregido usa `aria-pressed`.
- **Acceso:** formulario disponible durante la comprobación de sesión. Al comenzar el acceso se cancela esa comprobación, limitada a 15 segundos. Peticiones de acceso de más de 4 segundos muestran aviso. En registro, el campo anuncia y exige un mínimo de ocho caracteres; la API aplica el mismo mínimo.
- **Navegación y foco:** ruta activa con `aria-current`; menú con `aria-expanded`; enlace para saltar al contenido. La navegación activa de trabajo usa `soft` y `accent`, sin subrayado; la navegación pública conserva el subrayado. Foco visible de 3px con separación de 3px; el editor usa 2px de acento por dentro.
- **Tema:** primera visita según el dispositivo; sigue sus cambios mientras no haya elección manual. El selector marca la elección manual y la guarda en `diario.theme`; posteriores visitas priorizan ese valor. El diseño, la ilustración y `theme-color` cambian juntos.
- **Ilustraciones:** tres escenas por tema (escribir, aprender y recordar), en un sprite WebP transparente de 1536×1024, cuadrícula 3×2, 224658 bytes. Proceden de la hoja de seis iconos aportada por la usuaria, preparada con image_gen para retirar etiquetas y fondos antes de codificarla como WebP. No son el archivo original sin procesamiento. Procedencia y prompt en `frontend/src/assets/journal-illustrations.provenance.json` y `journal-illustrations.webp.json`. `JournalArt` las recorta por posición CSS y las marca como decorativas con `aria-hidden`.
- **Movimiento:** titular 650ms; apertura de tarjeta 750ms; revelado del cambio 700ms con demora de 300ms. Las estrellas hacen dos destellos de 1800ms con demoras máximas de 900ms: terminan en 4500ms y permanecen estáticas. Botones transicionan 180ms; el desplazamiento de hover de −1px solo se activa con hover y puntero preciso. Se conserva la entrada previa del papel de 320ms/5px desde 881px, sin animar el texto mientras se escribe o lee. El indicador de carga gira mientras hay petición. Movimiento reducido elimina animaciones y transiciones, y usa desplazamiento inmediato.

## Do's and Don'ts

### Do

- Respetar las referencias ilustradas de la usuaria y mantener las seis escenas con procedencia documentada.
- Mantener jerarquía, orden funcional y legibilidad en claro, oscuro y móvil.
- Extender la atmósfera a todas las vistas del tema y mantener el área de escritura sólida.
- Distinguir el pie oscuro de la tarjeta de la cabecera pública transparente.
- Mostrar guardado, espera, error y estado vacío con texto explícito.
- Diferenciar entradas en cuenta, borradores locales y datos de demo.

### Don't

- No sustituir las escenas por iconos SVG simplificados ni incrustar el mockup como página.
- No añadir vídeo, parallax o destellos decorativos infinitos.
- No usar serif en el texto editable ni convertir el historial en tarjetas.
- No presentar reglas limitadas como corrección contextual con IA ni puntajes como certificación MCER.
- No inventar testimonios, rachas ni estadísticas.
- No animar el texto durante la escritura o lectura.
