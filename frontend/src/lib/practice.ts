import type { Level } from "./types";
export const practice: Record<Level, {focus: string; prompts: string[]}> = {
 A1: {focus: "Frases personales, presente simple y vocabulario cotidiano.", prompts: ["How are you today? What do you like?", "Describe your room.", "What do you do every morning?"]},
 A2: {focus: "Experiencias con pasado simple, emociones y conectores como because o then.", prompts: ["What made you smile today?", "What did you do yesterday? How did you feel?", "What are you going to do tomorrow, and why?"]},
 B1: {focus: "Conecta experiencias y opiniones. Practica los tiempos pasados y explica tus razones.", prompts: ["What have you learned this week, and when did you learn it?", "Describe a decision you made and explain your reasons.", "What would you change about today if you could?"]},
 B2: {focus: "Explora alternativas, deseos y arrepentimientos; adapta el tono a lo que quieres contar.", prompts: ["What do you wish had gone differently today?", "Compare two choices you faced and their consequences.", "How might today have changed if you had made a different decision?"]},
 C1: {focus: "Expresa matices y organiza ideas complejas según tu intención.", prompts: ["Explore a moment when your feelings contradicted your expectations.", "Reframe an experience from someone else's perspective without losing its nuance.", "What matters most about a recent conversation, and why?"]},
 C2: {focus: "Afina el significado, el registro y la voz propia. Reformula sin perder matices.", prompts: ["Revisit an ambiguous memory and explore its competing interpretations.", "Describe a subtle feeling, choosing words for their connotations.", "Retell a moment in two tones while preserving its meaning."]},
};
