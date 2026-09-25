# 📖 Diario de Idiomas

Un diario para escribir tu día **en inglés** y que te corrija mientras escribes. Le cuentas cómo te fue, y la app te devuelve tu texto corregido, te explica en qué te equivocaste (según tu nivel) y te va mostrando en qué temas fallas más. La idea es aprender sin que se sienta como estudiar.

## Por qué lo hice

La verdad es que este proyecto nació de algo personal. Mi psicólogo me recomendó escribir un diario para desahogarme, para sacar lo que siento en el día, sea bueno o malo. Me encantó la idea, pero pensé: ¿y si además de desahogarme aprovecho para aprender algo?

Yo sé inglés, pero básico, y justo estoy tratando de mejorarlo. El problema es que cuando escribo un diario a mano o en las notas del celular, no hay nada que me diga si lo estoy escribiendo bien, si usé mal un conector o si hay una mejor forma de decir las cosas. Así que se me ocurrió juntar las dos cosas: un diario donde escribo cómo fue mi día y, al corregirlo, se guarda solito en un historial (parecido a la app de Notas) y me va corrigiendo. Del tipo "oye, este conector no va, mejor usa este otro" o "vas bien, solo corrige esto".

Y con el historial puedo ver cómo voy mejorando con el tiempo. Quizás en agosto escribía con varios errores y para septiembre ya escribo mejor. Esa es la gracia.

## 🌐 Pruébalo aquí

**👉 https://cathv-24.github.io/diario_idioma/**

Funciona directo en el navegador, no necesitas instalar nada. Escribe algo en inglés, dale a "Corregir mi día" y listo. Tu historial se guarda en tu propio navegador.

> **Nota:** la demo online usa un corrector que corre en el mismo navegador, porque GitHub Pages solo permite publicar la parte visual (el frontend). La parte del servidor (backend + base de datos) se corre en local. La app se da cuenta sola: si hay servidor lo usa, y si no, usa el corrector del navegador.

## Qué hace

- Escribes tu día en inglés y lo corriges con un clic.
- Te corrige **según tu nivel** (A1 a C2). Si estás en nivel básico, las explicaciones te salen en español; si ya estás más avanzada, te las da en inglés.
- Cada error viene **explicado** y con su categoría: ortografía, gramática, puntuación, vocabulario, artículos y mayúsculas.
- Te da un **puntaje** del 0 al 100 y un **resumen de los temas en los que más fallas**, para que sepas qué reforzar.
- Guarda todo en un **historial** para que veas tu progreso.
