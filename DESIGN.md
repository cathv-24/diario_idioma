---
name: Diario de Idiomas
description: Un paisaje abierto para escribir; un cuaderno preciso para aprender.
colors:
  background: "#ffffff"
  foreground: "#171916"
  secondary: "#6f6f6f"
  line: "#e6e7e3"
  accent: "#697459"
  companion: "#30392e"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
    lineHeight: 0.95
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  panel: "4px"
  pill: "999px"
spacing:
  small: "8px"
  medium: "24px"
  large: "48px"
---

## Overview
Dirección visual fijada por la usuaria: portada cinematográfica blanca, vídeo de paisaje, títulos Instrument Serif con énfasis en cursiva y cuerpo Inter. Se adapta al diario, conservando su motivación personal. El editor prioriza concentración y el historial lectura. No se generan imágenes: el vídeo proporcionado ya ocupa la función visual.

## Colors
Blanco y negro dominan la portada. El gris #6F6F6F jerarquiza la descripción. El verde oliva distingue correcciones y el acompañante de escritura; no representa una calificación personal.

## Typography
Instrument Serif para titulares y texto del diario. Inter para controles y explicaciones. Tamaños fluidos y titulares de dos líneas; no ocultar el propósito del producto.

## Layout
Rail máximo 1240px; márgenes 48px en escritorio y 20–25px en móvil. Portada centrada y de pantalla completa; editor de dos columnas que se apila en móvil. Historial en filas de lectura. Progreso calculado desde entradas reales, sin métricas precargadas.

## Elevation & Depth
Cristal translúcido solo en el control que flota sobre el vídeo y la navegación móvil. Sombra suave en el ejemplo de corrección, que está rotulado como ejemplo.

## Shapes
Botones principales redondos; superficies de trabajo con radio 4px y bordes finos.

## Components
Vídeo con bucle manual, fundidos de 0,5s y pausa. Entradas de portada fade-rise 0,8s con retardos 0,2 y 0,4s. Reduced motion pausa el vídeo y elimina desplazamientos. Hover con escala 1,03 solo para puntero fino. Formularios con labels, estados deshabilitados, guardado visible y conservación del borrador ante errores.

## Do's and Don'ts
No prometer corrección contextual con IA. No presentar puntajes como diagnóstico MCER. No introducir nombres de herramientas en los flujos del diario. No inventar testimonios, rachas ni estadísticas. Evitar movimiento en el texto que se está escribiendo o leyendo.

## Ajuste para escritura cotidiana

Editor y resultado: Inter 18 px, 17 px en móvil, interlineado 1.85 y fondo blanco liso. Instrument Serif se reserva para títulos. La guía de niveles usa divulgación progresiva con details/summary; las preguntas acompañan el nivel elegido. La pantalla de escritura ofrece las tres entradas recientes. Al abrir la aplicación sin ruta, un perfil existente llega al editor.

El acceso ofrece pestañas Iniciar sesión / Crear cuenta, campos con autocompletado apropiado y mensajes de carga/error. Las contraseñas no se guardan en localStorage; el servidor mantiene una sesión HttpOnly. Cerrar sesión vacía la vista de entradas y el editor.
