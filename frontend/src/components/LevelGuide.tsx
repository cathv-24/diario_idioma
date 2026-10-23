import guide from "../lib/levels.json";
import type { Level } from "../lib/types";
export default function LevelGuide({level}: {level: Level}) {
 const item = guide[level];
 return <details className="level-guide" key={level}>
 <summary>Conoce tu nivel: {level} · {item.name}</summary>
 <p>{item.description}</p>
 <p className="level-note">Elige el nivel que mejor describe lo que puedes hacer. El diario orienta tu práctica; no evalúa por sí solo tu comprensión auditiva ni tu expresión oral.</p>
 <div className="level-guide-grid">{item.sections.map(section => <section key={section.title}><h3>{section.title}</h3><ul>{section.items.map(text => <li key={text}>{text}</li>)}</ul></section>)}</div>
 <p className="level-note">Basado en la guía de aprendizaje que compartiste. Los temas son orientativos, no requisitos para certificar el MCER.</p>
 </details>;
}
