import { ArrowRight, BookOpen, CheckCircle2, CheckCheck, PenLine } from "lucide-react";
import JournalArt from "./JournalArt";

export default function Landing({ onStart }: { onStart: () => void }) {
  return <div className="journal-landing">
    <div className="night-atmosphere" aria-hidden="true">{Array.from({length:18}, (_, index) => <span key={index}/>)}</div>
    <section className="journal-hero section-shell">
      
      <h1>Escribe tu día.<br className="mobile-break"/> <em>Aprende en el camino.</em></h1>
      <p>Un espacio para desahogarte, entender tus errores y seguir<br className="desktop-break"/> escribiendo, sin la presión de ser perfecto.</p>
      <div className="journal-hero-actions">
        <button className="button dark" onClick={onStart}>Empieza a escribir gratis <ArrowRight size={17}/></button>
        <a className="text-link" href="#como-funciona" onClick={(event) => { event.preventDefault(); document.getElementById("como-funciona")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }}>Ver cómo funciona <ArrowRight size={16}/></a>
      </div>
    </section>
    <section className="journal-story section-shell" id="como-funciona">
      <div className="journal-benefits">
        <h2>No se trata de escribir perfecto.<br/><em>Se trata de seguir escribiendo.</em></h2>
        <ol className="illustrated-steps">
          <li><JournalArt scene="write"/><h3>Desahógate</h3><p>Saca lo que sientes, sea bueno o malo. Un espacio para contar tu día.</p></li>
          <li><JournalArt scene="learn"/><h3>Aprende de tus errores</h3><p>Revisa cambios explicados y encuentra otras formas de decir lo que viviste.</p></li>
          <li><JournalArt scene="remember"/><h3>Tu historia, en tu voz</h3><p>Vuelve a tus días, relee tus palabras y observa tu recorrido, paso a paso.</p></li>
        </ol>
      </div>
      <div className="journal-preview">
        <span className="preview-note">Corrección sin presión</span>
        <div className="landing-example" aria-label="Ejemplo de una entrada y sus correcciones">
          <div className="demo-toolbar"><span><PenLine size={16}/> Mi día · 23 de octubre</span><span>Ejemplo · A2</span></div>
          <p className="demo-question">What made you smile today?</p>
          <p className="demo-writing" lang="en">Today was a good day.<br/>Yesterday <del>i goed</del> <mark>I went</mark> to the park.<br/>I felt happy and a little more relaxed.</p>
          <div className="demo-explanation"><CheckCircle2 size={20}/><div><strong>Tu historia, un pequeño cambio</strong><p>Para hablar del pasado, usa «went»: <span lang="en">I went to the park.</span></p></div></div>
          <div className="demo-footer"><span><CheckCheck size={16}/> Escribe · entiende · guarda</span><span>Sin punto final obligatorio</span></div>
        </div>
      </div>
    </section>
    <p className="journal-limits section-shell">El corrector reconoce patrones concretos. No revisa todo el contexto ni determina tu nivel de inglés.</p>
    <section className="closing section-shell"><BookOpen size={30}/><div><h2>Hay un lugar para tu día.</h2><p>Empieza con una frase. Lo demás puede venir después.</p></div><button className="button outline" onClick={onStart}>Abrir mi diario <ArrowRight size={17}/></button></section>
  </div>;
}
