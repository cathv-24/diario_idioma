import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { placementQuestions, placementResult } from "../lib/placement";
import type { Level } from "../lib/types";

export default function PlacementCheck({ onFinish, onBack }: {
  onFinish: (level: Level) => void;
  onBack: () => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => placementQuestions.map(() => null),
  );
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (done) resultHeading.current?.focus();
    else if (moved.current) questionHeading.current?.focus();
  }, [index, done]);
  const question = placementQuestions[index];
  const result = placementResult(answers);
  return (
    <section className="placement-check" aria-label="Orientación inicial de inglés">
      <button type="button" className="text-link" onClick={onBack}>
        <ArrowLeft size={16} /> Volver al registro
      </button>
      <h2>Un punto de partida para tu camino.</h2>
      <p>Ocho frases breves nos ayudan a sugerir actividades. Puedes cambiar tu nivel después; esto no es un examen ni una evaluación oficial.</p>
      {done ? (
        <div className="placement-result" role="status">
          <strong ref={resultHeading} tabIndex={-1}>Te sugerimos empezar en {result.level}</strong>
          <p>Acertaste {result.correct} de {placementQuestions.length}. Esta orientación solo mira algunas estructuras escritas; todavía no evalúa tu voz, lectura ni escritura libre.</p>
          <button type="button" className="button dark" onClick={() => onFinish(result.level)}>
            Continuar con {result.level} <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="placement-question">
          <span>Frase {index + 1} de {placementQuestions.length}</span>
          <progress max={placementQuestions.length} value={index + 1} aria-label={`Frase ${index + 1} de ${placementQuestions.length}`} />
          <h3 ref={questionHeading} tabIndex={-1} lang="en">{question.prompt}</h3>
          <div role="group" aria-label="Elige la palabra que completa la frase" lang="en">
            {question.choices.map((choice, choiceIndex) => (
              <button key={choiceIndex} type="button" aria-pressed={answers[index] === choiceIndex}
                onClick={() => setAnswers(current => current.map((answer, answerIndex) => answerIndex === index ? choiceIndex : answer))}>
                {choice}
              </button>
            ))}
          </div>
          <div className="placement-actions">
            <button type="button" className="text-link" disabled={index === 0} onClick={() => { moved.current = true; setIndex(index - 1); }}>Anterior</button>
            <button type="button" className="button dark" disabled={answers[index] === null} onClick={() => { moved.current = true; if (index === placementQuestions.length - 1) setDone(true); else setIndex(index + 1); }}>
              {index === placementQuestions.length - 1 ? "Ver orientación" : "Siguiente"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
