import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mic, Square, Volume2 } from "lucide-react";
import { compareSpeech, speak } from "../lib/speech";

interface Recognition {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
function recognitionConstructor() {
  const host = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return host.SpeechRecognition || host.webkitSpeechRecognition;
}

export default function SpeakingPractice({ phrase, prompt, onWrite }: { phrase: string; prompt: string; onWrite: (text: string) => void }) {
  const [mode, setMode] = useState<"guided" | "free">("guided");
  const [consent, setConsent] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognition = useRef<Recognition | null>(null);
  useEffect(() => () => {
    if (recognition.current) {
      recognition.current.onend = null;
      recognition.current.onerror = null;
      recognition.current.onresult = null;
      recognition.current.abort();
    }
    window.speechSynthesis?.cancel();
  }, []);
  function start() {
    const Constructor = recognitionConstructor();
    if (!Constructor || !consent || listening) return;
    const session = new Constructor();
    recognition.current = session;
    session.lang = "en-GB";
    session.continuous = true;
    session.interimResults = false;
    let heard = "";
    session.onresult = event => {
      heard = Array.from(event.results).map(result => result[0].transcript).join(" ");
      setTranscript(heard.slice(0, 10000));
    };
    session.onerror = event => setError(event.error === "not-allowed"
      ? "El micrófono no tiene permiso. Puedes habilitarlo desde la configuración del sitio."
      : "No pudimos reconocer el audio. Acércate al micrófono y vuelve a intentarlo.");
    session.onend = () => setListening(false);
    setError(""); setTranscript(""); setListening(true);
    try { session.start(); } catch { setListening(false); setError("No pudimos abrir el micrófono. Vuelve a intentarlo."); }
  }
  const comparison = compareSpeech(phrase, transcript);
  return <section className="speaking-practice">
    <h2>Dale voz a un momento.</h2>
    <div className="learning-tabs" role="group" aria-label="Tipo de práctica oral">
      <button aria-pressed={mode === "guided"} disabled={listening} onClick={() => { setMode("guided"); setTranscript(""); }}>Leer una frase</button>
      <button aria-pressed={mode === "free"} disabled={listening} onClick={() => { setMode("free"); setTranscript(""); }}>Contarlo a mi manera</button>
    </div>
    <p className="speaking-phrase" lang="en">{mode === "guided" ? phrase : prompt}</p>
    {mode === "guided" && <button className="text-link" disabled={listening} onClick={() => speak(phrase, setError)}><Volume2 size={17} /> Escuchar ejemplo</button>}
    <p className="small-muted">Comparamos palabras reconocidas. La transcripción puede equivocarse y todavía no permite evaluar fonemas, acento ni ritmo con precisión.</p>
    {recognitionConstructor() ? <>
      <label className="learning-consent"><input type="checkbox" checked={consent} disabled={listening} onChange={e => setConsent(e.target.checked)} />
        <span>Acepto usar el reconocimiento del navegador para esta práctica. Su proveedor puede procesar el audio. La aplicación no guarda la grabación.</span>
      </label>
      <button className="button dark" disabled={!consent} onClick={() => listening ? recognition.current?.stop() : start()}>
        {listening ? <><Square size={16} /> Terminar grabación</> : <><Mic size={16} /> Empezar a hablar</>}
      </button>
      <p role="status">{listening ? "Te escuchamos. Pulsa Terminar grabación cuando acabes." : ""}</p>
    </> : <p className="learning-feedback">El reconocimiento de voz no está disponible en este navegador. Puedes escuchar el ejemplo y practicar en voz alta.</p>}
    {error && <p role="alert" className="learning-feedback">{error}</p>}
    {transcript && <div className="speech-result">
      <h3>Esto reconoció el navegador</h3><p lang="en">{transcript}</p>
      {mode === "guided" && <p>{comparison.missing.length || comparison.extra.length
        ? `No reconoció: ${comparison.missing.join(", ") || "ninguna palabra omitida"}. Reconoció además: ${comparison.extra.join(", ") || "ninguna"}. Escucha el ejemplo y prueba otra vez.`
        : "Reconoció todas las palabras de la frase. Puedes probar con otra frase; esto no confirma una pronunciación perfecta."}</p>}
      {mode === "free" && <button className="text-link" disabled={listening} onClick={() => onWrite(transcript)}>Llevarlo a mi diario para revisar las palabras <ArrowRight size={16} /></button>}
    </div>}
  </section>;
}
