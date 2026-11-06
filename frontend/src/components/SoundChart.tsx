import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { soundGroups } from "../lib/reference";
import { speak } from "../lib/speech";

export default function SoundChart() {
  const player = useRef<HTMLAudioElement | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => () => { player.current?.pause(); window.speechSynthesis?.cancel(); }, []);
  async function play(symbol: string, example: string, code: string | null) {
    player.current?.pause();
    window.speechSynthesis?.cancel();
    setMessage(code ? `Sonido /${symbol}/. Después puedes escuchar «${example}».` : `Escuchando la palabra «${example}», que contiene /${symbol}/.`);
    if (!code) { speak(example, setMessage); return; }
    const audio = player.current;
    if (!audio) return;
    audio.src = `https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/${code}.mp3`;
    try { await audio.play(); } catch { setMessage("No pudimos cargar el sonido. Puedes escuchar la palabra de ejemplo con el botón del altavoz."); }
  }
  return <section>
    <h2>Reconoce el sonido, encuentra tu voz.</h2>
    <p className="small-muted">Pulsa un símbolo para escuchar su sonido aislado. En diptongos y consonantes combinadas escucharás la palabra de ejemplo. Las vocales aisladas son referencias IPA; la voz del ejemplo puede variar según tu dispositivo.</p>
    <p className="sound-status" role="status">{message || "Prueba /ɪ/ de ship y /iː/ de tree. Escucha la diferencia sin prisa."}</p>
    <audio ref={player} controls preload="none" aria-label="Audio del sonido seleccionado" className="phoneme-player" />
    {soundGroups.map(group => <div className="sound-group" key={group.title}>
      <h3>{group.title}</h3>
      <div className="sound-grid">{group.sounds.map(([symbol, example, code]) => <div className="sound-cell" key={symbol}>
        <button onClick={() => void play(symbol, example, code)} aria-label={`Escuchar ${code ? "sonido" : "ejemplo de"} /${symbol}/`}><strong>/{symbol}/</strong><span>{example}</span></button>
        <button className="icon-button" aria-label={`Escuchar palabra ${example}`} onClick={() => { player.current?.pause(); speak(example, setMessage); }}><Volume2 size={16} /></button>
      </div>)}</div>
    </div>)}
    <p className="small-muted">Grabaciones de referencia: J. C. Wells, <a href="https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html" target="_blank" rel="noreferrer">International Phonetic Association</a>. Ejemplos de palabras reproducidos por la voz del dispositivo.</p>
  </section>;
}
