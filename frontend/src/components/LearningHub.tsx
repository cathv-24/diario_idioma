import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, Bookmark, Check, LoaderCircle, Search, Volume2 } from "lucide-react";
import * as api from "../lib/api";
import { defaultUnit, recommendUnit, units, type LearningState, type LearningUnit } from "../lib/learning";
import { irregularVerbs } from "../lib/reference";
import { speak } from "../lib/speech";
import type { Entry, Profile } from "../lib/types";
const SoundChart = lazy(() => import("./SoundChart"));
const SpeakingPractice = lazy(() => import("./SpeakingPractice"));
type Activity = "story" | "words" | "verbs" | "sounds" | "speak";
const activities: [Activity, string][] = [["story", "Una historia"], ["words", "Palabras"], ["verbs", "Verbos irregulares"], ["sounds", "Sonidos"], ["speak", "Tu voz"]];

export default function LearningHub({ profile, entries, onWrite }: {
  profile: Profile; entries: Entry[]; onWrite: (prompt: string, transcript?: string) => void;
}) {
  const [state, setState] = useState<LearningState>({ unidadActual: defaultUnit(profile.nivel), lecturasCompletadas: [], palabrasGuardadas: [] });
  const [activity, setActivity] = useState<Activity>("story");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setReady(false);
    void api.loadLearning(profile).then(data => { if (active) { setState(data); setReady(true); } })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; window.speechSynthesis?.cancel(); };
  }, [profile.idUsuario, attempt]);
  const unit = units.find(item => item.id === state.unidadActual) || units[0];
  const recommendation = recommendUnit(entries, profile.nivel);
  async function save(next: LearningState) {
    if (busy || loading || !ready) return;
    setBusy(true); setError("");
    try { setState(await api.saveLearning(profile, next)); }
    catch (e) { setError(e instanceof Error ? e.message : "No pudimos guardar tu avance. Vuelve a intentarlo."); }
    finally { setBusy(false); }
  }
  function choose(id: string) { window.speechSynthesis?.cancel(); void save({ ...state, unidadActual: id }); }
  const allWords = units.flatMap(item => item.words);
  const words = (savedOnly ? allWords : unit.words).filter(([word, meaning]) =>
    (!savedOnly || state.palabrasGuardadas.includes(word)) && `${word} ${meaning}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="learning-hub">
    <div className="page-title"><div><h1>Tu inglés, en tu vida.</h1><p className="greeting">Una historia, una palabra o un momento para ti. Elige por dónde seguir.</p></div></div>
    <div className="learning-recommendation">
      <div><strong>Para tu próxima pausa: {recommendation.unit.title}</strong><p>{recommendation.reason}</p></div>
      <button className="text-link" disabled={loading || busy || !ready} onClick={() => { choose(recommendation.unit.id); setActivity("story"); }}>Explorar <ArrowRight size={16} /></button>
    </div>
    {error && <div className="learning-feedback" role="alert"><p>{error}</p>{loading === false && <button className="text-link" onClick={() => { setError(""); setAttempt(attempt + 1); }}>Volver a cargar mi avance</button>}</div>}
    {loading ? <p className="learning-loading" role="status"><LoaderCircle size={19} className="spin" /> Abriendo tu camino…</p> : ready && <div className="learning-layout">
      <aside className="learning-route" aria-label="Ruta de práctica">
        <h2>De lo cotidiano a lo nuevo.</h2>
        <p>Doce temas para practicar a tu ritmo. Puedes saltar, volver o simplemente escribir.</p>
        <label className="mobile-unit-select">Tema de hoy<select value={unit.id} disabled={busy} onChange={e => choose(e.target.value)}>{units.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title}</option>)}</select></label>
        <ol>{units.map((item, index) => <li key={item.id}>
          <button disabled={busy} aria-current={item.id === unit.id ? "step" : undefined} onClick={() => choose(item.id)}>
            <span className="unit-number">{state.lecturasCompletadas.includes(item.id) ? <Check size={16} aria-label="Lectura completada" /> : index + 1}</span>
            <span><strong>{item.title}</strong><small>{item.focus}</small></span>
          </button>
        </li>)}</ol>
        {["B1", "B2", "C1", "C2"].includes(profile.nivel) && <p className="small-muted">Esta primera ruta cubre fundamentos A1–A2. Puedes usarlos para repasar; el diario mantiene las propuestas correspondientes a tu nivel.</p>}
      </aside>
      <div className="learning-content" aria-busy={busy}>
        <div className="learning-tabs" role="group" aria-label="Qué quieres hacer hoy">{activities.map(([key, label]) => <button key={key} aria-pressed={activity === key} onClick={() => { window.speechSynthesis?.cancel(); setActivity(key); setQuery(""); }}>{label}</button>)}</div>
        <Suspense fallback={<p role="status">Abriendo actividad…</p>}>
          {activity === "story" && <ReadingStory key={unit.id} unit={unit} completed={state.lecturasCompletadas.includes(unit.id)} busy={busy}
            onComplete={() => void save({ ...state, lecturasCompletadas: [...new Set([...state.lecturasCompletadas, unit.id])] })} onWrite={() => onWrite(unit.prompt)} />}
          {activity === "words" && <section>
            <h2>Palabras que puedes hacer tuyas.</h2>
            <p className="small-muted">Escúchalas, guárdalas y pruébalas en una historia tuya.</p>
            <label className="reference-search"><Search size={17} /><input aria-label="Buscar vocabulario" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar palabra o significado" /></label>
            <label className="learning-consent"><input type="checkbox" checked={savedOnly} onChange={e => setSavedOnly(e.target.checked)} /> Ver solo mis palabras guardadas ({state.palabrasGuardadas.length})</label>
            <ul className="vocabulary-list">{words.map(([word, meaning, example]) => <li key={word}>
              <div><h3 lang="en">{word}</h3><span>{meaning}</span><p lang="en">{example}</p></div>
              <div><button className="icon-button" aria-label={`Escuchar ${word}`} onClick={() => speak(example, setError)}><Volume2 size={17} /></button>
                <button className="icon-button" disabled={busy} aria-label={`${state.palabrasGuardadas.includes(word) ? "Quitar" : "Guardar"} palabra ${word}`} aria-pressed={state.palabrasGuardadas.includes(word)} onClick={() => void save({ ...state, palabrasGuardadas: state.palabrasGuardadas.includes(word) ? state.palabrasGuardadas.filter(item => item !== word) : [...state.palabrasGuardadas, word] })}><Bookmark size={17} /></button></div>
            </li>)}</ul>
            {!words.length && <p className="learning-feedback">{savedOnly ? "Todavía no hay palabras guardadas que coincidan. Desactiva el filtro para descubrir algunas." : "No encontramos esa palabra en esta unidad. Prueba otro término."}</p>}
            <button className="text-link" onClick={() => onWrite(unit.prompt)}>Usar una palabra en mi diario <ArrowRight size={16} /></button>
          </section>}
          {activity === "verbs" && <section>
            <h2>Ayer también tiene sus palabras.</h2>
            <p className="small-muted">Consulta el pasado de un verbo y vuelve a lo que querías contar. En inglés británico se usa got como participio; gotten es frecuente en inglés estadounidense.</p>
            <label className="reference-search"><Search size={17} /><input aria-label="Buscar verbo irregular" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar go, went, ir…" /></label>
            <div className="verb-table-wrap"><table className="verb-table"><caption>Verbos irregulares · infinitivo, pasado y participio</caption><thead><tr><th>Infinitivo</th><th>Pasado</th><th>Participio</th><th>Significado</th><th><span className="sr-only">Audio</span></th></tr></thead><tbody>
              {irregularVerbs.filter(row => row.join(" ").toLowerCase().includes(query.toLowerCase())).map(([base, past, participle, meaning]) => <tr key={base}><td lang="en">{base}</td><td lang="en">{past}</td><td lang="en">{participle}</td><td>{meaning}</td><td><button className="icon-button" aria-label={`Escuchar formas de ${base}`} onClick={() => speak(base === "read" ? "I read every day. Yesterday I read a story. I have read that story." : `${base}. ${past}. ${participle}.`, setError)}><Volume2 size={16} /></button></td></tr>)}
            </tbody></table></div>
            {!irregularVerbs.some(row => row.join(" ").toLowerCase().includes(query.toLowerCase())) && <p role="status">No encontramos ese verbo. Prueba con su significado o con otra de sus formas.</p>}
          </section>}
          {activity === "sounds" && <SoundChart />}
          {activity === "speak" && <SpeakingPractice key={unit.id} phrase={unit.example} prompt={unit.prompt} onWrite={transcript => onWrite(unit.prompt, transcript)} />}
        </Suspense>
      </div>
    </div>}
    <p className="learning-source small-muted">Secuencia temática inspirada en Navigate Elementary; actividades y relatos originales. Completar los temas no acredita un nivel.</p>
  </div>;
}

function ReadingStory({ unit, completed, busy, onComplete, onWrite }: {
  unit: LearningUnit; completed: boolean; busy: boolean; onComplete: () => void; onWrite: () => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return <section className="reading-story">
    <h2>{unit.story.title}</h2>
    <p className="reading-body" lang="en">{unit.story.text}</p>
    <fieldset><legend lang="en">{unit.story.question}</legend>{unit.story.choices.map((choice, index) => <label key={choice}>
      <input type="radio" name={`reading-${unit.id}`} checked={answer === index} onChange={() => { setAnswer(index); setChecked(false); }} /> <span lang="en">{choice}</span>
    </label>)}</fieldset>
    <button className="button outline" disabled={answer === null || busy} onClick={() => { setChecked(true); if (answer === unit.story.answer) onComplete(); }}>Comprobar mi lectura</button>
    {checked && <p role="status" className="learning-feedback">{answer === unit.story.answer ? "Sí, esa es la idea del relato. Ahora puedes conectarla con algo que te haya pasado." : "Vuelve al relato y busca la parte que responde la pregunta. Puedes intentarlo de nuevo."}</p>}
    {completed && <p className="reading-completed"><Check size={16} /> Lectura completada y guardada en tu camino.</p>}
    <details className="grammar-note"><summary>Una pista para contarlo tú: {unit.focus}</summary><p>{unit.explanation}</p><p lang="en">{unit.example}</p></details>
    <div className="reading-to-diary"><h3>¿Y en tu historia?</h3><p lang="en">{unit.prompt}</p><button className="button dark" onClick={onWrite}>Llevar esta idea a mi diario <ArrowRight size={16} /></button></div>
  </section>;
}
