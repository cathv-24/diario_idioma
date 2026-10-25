---
name: Diario de Idiomas
description: Un cuaderno personal legible que convierte errores concretos en aprendizaje.
colors:
  background: "#fafaf8"
  surface: "#ffffff"
  soft: "#f0f0ea"
  ink: "#242521"
  muted: "#696a63"
  accent: "#5b654c"
  accent-hover: "#444e37"
  line: "#e2e3db"
  focus: "#687653"
  mark: "#ecefdc"
  mark-ink: "#3c482b"
  danger: "#b42332"
  danger-soft: "#fff0f0"
  nav: "#ffffff"
  action: "#242521"
  action-ink: "#ffffff"
  dark-background: "#191a17"
  dark-surface: "#20211d"
  dark-soft: "#2b2d25"
  dark-ink: "#edeee7"
  dark-muted: "#b4b7aa"
  dark-accent: "#bbc6a3"
  dark-accent-hover: "#d1d9bd"
  dark-line: "#3a3d32"
  dark-focus: "#bbc6a3"
  dark-mark: "#343c26"
  dark-mark-ink: "#e1e8cb"
  dark-danger: "#ffacb4"
  dark-danger-soft: "#382327"
  dark-nav: "#1b1c18"
  dark-action: "#edeee7"
  dark-action-ink: "#20211d"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(44px, 4.7vw, 64px)"
    fontWeight: 400
    lineHeight: 1.08
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
  field: "3px"
  button: "3px"
  paper: "3px"
  flat: "0"
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
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
  correction-mark:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.mark-ink}"
    padding: "0 2px"
  writing-prompt:
    backgroundColor: "transparent"
    rounded: "{rounded.flat}"
    padding: "20px 0"
---

# Design System: Diario de Idiomas

## Overview

**Creative North Star: "Un cuaderno personal legible"**

La escritura ocupa el centro. Instrument Serif en títulos y marca, Inter en el diario y los controles, blanco y tinta con oliva discreto acompañan el hábito de contar el día y entender cambios concretos. La dirección aprobada está en `.impeccable/surfaces/diario-redesign.md`; los valores se extraen de `frontend/src/styles/theme.css` y `fonts.css`.

La aplicación combina un espacio de trabajo con navegación estable, un historial para releer y una portada que muestra el producto mediante un ejemplo rotulado. El tema oscuro conserva la jerarquía y utiliza los colores de su propio conjunto.

**Key Characteristics:**

- Texto de escritura amplio y explicaciones cercanas al cambio.
- Tinta para acciones principales, oliva discreto para cambios y aprendizaje.
- Navegación lateral en escritorio y cabecera compacta en móvil.
- Temas claro y oscuro, sin vídeo de fondo.

## Colors

### Primary

El oliva discreto identifica enlaces, correcciones y foco de aprendizaje. Los botones principales usan tinta y texto blanco en claro; en oscuro emplean una acción clara con texto oscuro. La navegación activa se distingue mediante texto y subrayado.

### Neutral

El blanco cálido distingue el fondo de las superficies blancas. Tinta oscura, texto secundario y líneas finas sostienen la jerarquía. En oscuro cambian fondo, superficie, navegación, texto y bordes; no se aplica una inversión automática.

Un oliva pálido distingue fragmentos corregidos. El rojo se reserva para errores y acciones destructivas.

**The Meaningful Color Rule.** El color comunica acción, selección o estado; acompaña etiquetas, texto y bordes para que el significado no dependa solo del tono.

## Typography

Instrument Serif sirve para títulos, marca y preguntas de escritura. Inter Variable sirve para texto del diario, controles y explicaciones. Ambas familias se importan desde paquetes de Fontsource y se entregan con los recursos de la aplicación.

La portada usa el rol display; el título del espacio de trabajo usa headline. El editor usa el rol editor y cambia a editor-mobile hasta 640px. El resultado mantiene 20px en escritorio y 18px en móvil, con interlineado 1.9. Los controles y explicaciones son más pequeños sin competir con el diario.

**The Writing First Rule.** No reducir el texto del diario para acomodar controles secundarios.

## Layout

Fuera de Inicio, la navegación de escritorio ocupa una barra lateral fija de 224px. El contenido tiene un ancho máximo de 1360px y margen izquierdo equivalente a la barra. Hasta 880px, la barra se convierte en cabecera sticky con menú desplegable.

El editor usa una columna flexible y un acompañante de 272px; el resultado combina texto y explicaciones de 310px. Los anchos se ajustan en 1180px. Entre 881px y 1000px se apilan los paneles para preservar lectura. Hasta 640px, editor y resultado utilizan una columna y márgenes compactos.

La portada usa dos columnas de texto y ejemplo del producto, y se apila en móvil. El historial usa filas planas con fecha, extracto y acciones por entrada. Las métricas parten de entradas reales; los estados vacíos indican qué acción permite avanzar.

## Elevation & Depth

La superficie es plana, sin sombras en ninguno de los temas. Separadores finos y diferencias tonales organizan el contenido. No se usa cristal sobre un paisaje ni una capa de vídeo.

## Shapes

Campos, botones y papel tienen un radio mínimo de 3px. El historial y las preguntas se organizan como filas o bloques planos con separadores, sin tarjetas redondeadas. Las correcciones inline mantienen esquinas mínimas para permanecer dentro de la línea del texto.

## Components

- **Editor:** fecha, contador y estado del borrador acompañan el campo. Guardar muestra carga; un fallo conserva el texto. No se exige punto final.
- **Correcciones:** los fragmentos localizables son botones resaltados. Seleccionarlos marca el cambio y enfoca su explicación. Si los rangos no reproducen inequívocamente el texto corregido, se muestra el resultado real sin resaltar una palabra equivocada.
- **Original / Corregido:** botones con estado `aria-pressed`; conservan el texto de cada versión.
- **Acceso:** el formulario se muestra mientras la sesión se comprueba en segundo plano. Al iniciar una operación de acceso se cancela la comprobación previa; esta tiene un límite de 15 segundos. Durante una petición de acceso que tarda más de 4 segundos aparece un aviso de espera.
- **Navegación:** ruta activa con `aria-current`, menú móvil con `aria-expanded`, enlace para saltar al contenido que enfoca el main sin cambiar la ruta.
- **Tema:** selector claro/oscuro con preferencia local persistida.
- **Movimiento:** transición de botones de 180ms; entrada del papel de 320ms y 5px solo desde 881px; indicador de carga giratorio. La preferencia de movimiento reducido elimina animaciones y transiciones y usa desplazamiento inmediato. El texto que se está escribiendo permanece estable.

## Do's and Don'ts

### Do

- Mantener el diario legible y las explicaciones conectadas al cambio.
- Conservar la misma jerarquía en claro, oscuro y móvil.
- Mostrar guardado, espera, error y estado vacío con texto explícito.
- Diferenciar entradas en la cuenta de borradores locales y datos de demo.

### Don't

- No reintroducir vídeo, Nunito o el acento verde azulado.
- No usar serif en el texto editable ni convertir el historial en tarjetas.
- No presentar reglas limitadas como corrección contextual con IA.
- No presentar puntajes como diagnóstico o certificación MCER.
- No inventar testimonios, rachas ni estadísticas.
- No animar el texto mientras se escribe o se lee.
