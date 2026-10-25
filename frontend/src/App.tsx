import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Home,
  Info,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  PenLine,
  BarChart3,
  Search,
  Check,
  CheckCheck,
  Download,
  Trash2,
  Pencil,
  ChevronDown,
  Plus,
  LoaderCircle,
  Menu,
  X,
  CalendarDays,
  AlertCircle,
  Cloud,
  HardDrive,
  Copy,
  CheckCircle2,
} from "lucide-react";
import AuthPanel from "./components/AuthPanel";
import LevelGuide from "./components/LevelGuide";
import levelGuide from "./lib/levels.json";
import { practice } from "./lib/practice";
import InlineCorrections from "./components/InlineCorrections";
import * as api from "./lib/api";
import { categoryNames, levels, localDate, wordCount } from "./lib/types";
import type { Entry, Level, Profile, Category } from "./lib/types";
type View = "inicio" | "escribir" | "historial" | "progreso" | "acerca";
const labels: Record<View, string> = {
  inicio: "Inicio",
  escribir: "Mi diario",
  historial: "Historial",
  progreso: "Mi progreso",
  acerca: "La idea",
};
const dateLabel = (date: string) =>
  new Date(date.length === 10 ? date + "T12:00:00" : date).toLocaleDateString(
    "es-PE",
    { day: "numeric", month: "long", year: "numeric" },
  );
function currentView(): View {
  const hash = location.hash.slice(1);
  return hash in labels ? (hash as View) : "inicio";
}
function readDraft(profileId?: number): {
  text: string;
  date: string;
  editing?: number;
} {
  try {
    const raw = profileId
      ? localStorage.getItem(`diario.v3.draft.${profileId}`)
      : null;
    if (!raw) return { text: "", date: localDate() };
    try {
      const draft = JSON.parse(raw);
      if (typeof draft.text === "string" && typeof draft.date === "string")
        return {
          text: draft.text,
          date: draft.date,
          editing:
            typeof draft.editing === "number" ? draft.editing : undefined,
        };
    } catch {
      /* Version anterior: solo texto. */
    }
    return { text: raw, date: localDate() };
  } catch {
    return { text: "", date: localDate() };
  }
}

export default function App() {
  const [activeCorrection, setActiveCorrection] = useState<number | null>(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("diario.theme") || "light";
    } catch {
      return "light";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("diario.theme", theme);
    } catch {
      /* Preferencia opcional. */
    }
  }, [theme]);
  const [view, setView] = useState<View>(currentView);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mobile, setMobile] = useState(false);
  const [text, setText] = useState(() => readDraft().text);
  const [date, setDate] = useState(() => readDraft().date);
  const [editing, setEditing] = useState<number | undefined>(
    () => readDraft().editing,
  );
  const [selected, setSelected] = useState<Entry | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [pendingDelete, setPendingDelete] = useState<number>();
  const [prompt, setPrompt] = useState(0);
  const [draftState, setDraftState] = useState("");
  const [level, setLevel] = useState<Level>("A2");
  const [tab, setTab] = useState<"corregido" | "original">("corregido");
  const [copied, setCopied] = useState(false);
  const editor = useRef<HTMLTextAreaElement>(null);
  const sessionCheck = useRef<AbortController | null>(null);
  const draftSnapshot = useRef({ profile, text, date, editing });
  draftSnapshot.current = { profile, text, date, editing };
  const flushDraft = () => {
    const current = draftSnapshot.current;
    if (!current.profile) return;
    try {
      localStorage.setItem(
        `diario.v3.draft.${current.profile.idUsuario}`,
        JSON.stringify({
          text: current.text,
          date: current.date,
          editing: current.editing,
        }),
      );
    } catch {
      /* El texto sigue en el editor si el almacenamiento está lleno. */
    }
  };
  useEffect(() => {
    const expired = () => {
      flushDraft();
      setProfile(null);
      setEntries([]);
      setSelected(null);
      setNotice("");
    };
    window.addEventListener("diario:session-expired", expired);
    return () => window.removeEventListener("diario:session-expired", expired);
  }, []);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    sessionCheck.current = controller;
    const fn = () => {
      setView(currentView());
      setMobile(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", fn);
    void api
      .loadProfile(controller.signal)
      .then((p) => {
        if (!active || controller.signal.aborted) return;
        setProfile(p);
        if (p) {
          const draft = readDraft(p.idUsuario);
          setText(draft.text);
          setDate(draft.date);
          setEditing(draft.editing);
          setLevel(p.nivel);
          if (!location.hash) {
            location.hash = "escribir";
            setView("escribir");
          }
        }
      })
      .catch((e) => {
        if (active && !controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (active && !controller.signal.aborted) setAuthLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
      window.removeEventListener("hashchange", fn);
    };
  }, []);
  useEffect(() => {
    if (!profile) return;
    let active = true;
    setLoading(true);
    void api
      .listEntries(profile)
      .then((data) => {
        if (active) setEntries(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [profile]);
  useEffect(() => {
    if (!profile || authLoading) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(
          `diario.v3.draft.${profile.idUsuario}`,
          JSON.stringify({ text, date, editing }),
        );
        setDraftState(text ? "Borrador guardado en este navegador" : "");
      } catch {
        setDraftState("El navegador no pudo guardar el borrador");
      }
    }, 500);
    return () => clearTimeout(id);
  }, [text, date, editing, profile?.idUsuario, authLoading]);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(id);
  }, [notice]);
  const go = (next: View) => {
    location.hash = next;
  };
  const newEntry = () => {
    setSelected(null);
    setEditing(undefined);
    setDate(localDate());
    setError("");
    go("escribir");
  };
  const changeLevel = async (value: Level) => {
    if (!profile) {
      setLevel(value);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const p = await api.updateLevel(profile, value);
      setProfile(p);
      setLevel(value);
      setNotice("Nivel actualizado para tus próximas correcciones.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar el nivel.");
    } finally {
      setSaving(false);
    }
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !text.trim() || saving) return;
    flushDraft();
    setSaving(true);
    setError("");
    try {
      const result = await api.saveEntry(profile, text, date, editing);
      setEntries((list) => [
        result,
        ...list.filter((x) => x.idEntrada !== result.idEntrada),
      ]);
      setSelected(result);
      setEditing(undefined);
      setText("");
      setTab("corregido");
      setNotice("Entrada corregida y guardada en tu historial.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No pudimos guardar. Tu borrador sigue aquí.",
      );
    } finally {
      setSaving(false);
    }
  };
  const edit = (entry: Entry) => {
    if (
      text.trim() &&
      text.trim() !== entry.textoOriginal &&
      !window.confirm(
        "Tienes un borrador. ¿Quieres reemplazarlo por esta entrada?",
      )
    )
      return;
    setText(entry.textoOriginal);
    setDate(entry.fecha);
    setEditing(entry.idEntrada);
    setSelected(null);
    go("escribir");
  };
  const remove = async (id: number) => {
    setSaving(true);
    setError("");
    try {
      await api.deleteEntry(id);
      setEntries((data) => data.filter((e) => e.idEntrada !== id));
      if (selected?.idEntrada === id) setSelected(null);
      setPendingDelete(undefined);
      setNotice("Entrada eliminada.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No pudimos eliminar la entrada.",
      );
    } finally {
      setSaving(false);
    }
  };
  const exportEntries = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            version: 2,
            exportado: new Date().toISOString(),
            entradas: entries,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mi-diario-${localDate()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Historial exportado como JSON.");
  };
  const copyText = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.textoCorregido);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "No pudimos copiar. Puedes seleccionar el texto y copiarlo manualmente.",
      );
    }
  };
  const filtered = entries.filter(
    (e) =>
      (e.textoOriginal.toLowerCase().includes(search.toLowerCase()) ||
        e.textoCorregido.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "todos" || e.nivel === filter),
  );
  const totalWords = entries.reduce(
    (sum, e) => sum + wordCount(e.textoOriginal),
    0,
  );
  const average = entries.length
    ? Math.round(
        entries.reduce((sum, e) => sum + e.puntaje, 0) / entries.length,
      )
    : 0;
  const topics = entries
    .flatMap((e) => e.correcciones)
    .reduce(
      (acc, c) => {
        acc[c.categoria] = (acc[c.categoria] || 0) + 1;
        return acc;
      },
      {} as Partial<Record<Category, number>>,
    );
  const topicList = Object.entries(topics).sort((a, b) => b[1]! - a[1]!) as [
    Category,
    number,
  ][];
  const nav = (
    <>
      {(Object.keys(labels) as View[]).map((key) => (
        <a
          key={key}
          href={"#" + key}
          aria-current={view === key ? "page" : undefined}
          className={view === key ? "active" : ""}
        >
          {key === "inicio" ? (
            <Home size={18} />
          ) : key === "escribir" ? (
            <PenLine size={18} />
          ) : key === "historial" ? (
            <BookOpen size={18} />
          ) : key === "progreso" ? (
            <BarChart3 size={18} />
          ) : (
            <Info size={18} />
          )}
          {labels[key]}
        </a>
      ))}
    </>
  );
  return (
    <div
      className={`app ${view !== "inicio" ? "workspace-app" : ""}`}
      data-theme={theme}
    >
      <a
        className="skip-link"
        href="#contenido"
        onClick={(event) => {
          event.preventDefault();
          const content = document.getElementById("contenido");
          content?.focus({ preventScroll: true });
          content?.scrollIntoView({ block: "start", behavior: "instant" });
        }}
      >
        Saltar al contenido
      </a>
      <header
        className={`site-header ${view !== "inicio" ? "workspace-header" : ""}`}
      >
        <div className="nav-inner">
          <a
            href="#inicio"
            className="wordmark"
            aria-label="Diario de Idiomas, inicio"
          >
            diario<span className="brand-dot">.</span>
            <span className="brand-description">DE IDIOMAS</span>
          </a>
          <nav aria-label="Navegación principal" className="desktop-nav">
            {nav}
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button theme-toggle"
              aria-label={
                theme === "light" ? "Activar modo oscuro" : "Activar modo claro"
              }
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="button dark nav-cta" onClick={newEntry}>
              {profile ? "Escribir mi día" : "Empezar mi diario"}
              <ArrowUpRight size={15} />
            </button>
            <button
              className="icon-button menu-toggle"
              aria-expanded={mobile}
              aria-label={mobile ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Navegación móvil">
            {nav}
          </nav>
        )}
      </header>
      {notice && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {notice}
          <button
            className="icon-button"
            onClick={() => setNotice("")}
            aria-label="Cerrar aviso"
          >
            <X size={15} />
          </button>
        </div>
      )}
      <main id="contenido" tabIndex={-1}>
        {view === "inicio" ? (
          <>
            <section className="hero section-shell">
              <div className="hero-content">
                <h1>
                  Tu día, tus palabras.
                  <br />
                  <em>Tu inglés, un poco mejor.</em>
                </h1>
                <p className="hero-description">
                  Escribe lo que viviste, entiende tus errores y vuelve a tus
                  recuerdos. Un pequeño espacio para ti y para el inglés que
                  estás aprendiendo.
                </p>
                <button className="button dark hero-cta" onClick={newEntry}>
                  Empezar mi diario
                  <ArrowRight size={18} />
                </button>
                <p className="hero-caption">
                  <BookOpen size={16} /> Un diario personal. Una forma de
                  practicar.
                </p>
              </div>
              <div
                className="landing-example"
                aria-label="Ejemplo de una entrada y sus correcciones"
              >
                <div className="demo-toolbar">
                  <span>
                    <PenLine size={16} />
                    Una pequeña historia
                  </span>
                  <span>Ejemplo · A2</span>
                </div>
                <p className="demo-question">What made you smile today?</p>
                <p className="demo-writing" lang="en">
                  Yesterday <del>i goed</del> <mark>I went</mark> to the park.
                  <br />I felt happy and a little more relaxed.
                </p>
                <div className="demo-explanation">
                  <CheckCircle2 size={20} />
                  <div>
                    <strong>Una forma nueva de contar lo mismo</strong>
                    <p>
                      El pasado de «go» es «went». Tu historia conserva tu voz.
                    </p>
                  </div>
                </div>
                <div className="demo-footer">
                  <span>
                    <CheckCheck size={16} />
                    Escribe · entiende · guarda
                  </span>
                  <span>Sin punto final obligatorio</span>
                </div>
              </div>
            </section>
            <section className="how-section section-shell" id="como-funciona">
              <div className="section-heading">
                <h2>
                  Lo que te pasa también
                  <br />
                  puede enseñarte inglés.
                </h2>
                <p>
                  El hábito es escribir. El aprendizaje está en entender un
                  pequeño cambio cada vez.
                </p>
              </div>
              <ol className="learning-steps">
                <li>
                  <PenLine size={23} />
                  <div>
                    <h3>Haz espacio para tu día</h3>
                    <p>
                      Una conversación, algo que sentiste o ese detalle que
                      quieres recordar. Escribe en inglés, como puedas.
                    </p>
                  </div>
                </li>
                <li>
                  <BookOpen size={23} />
                  <div>
                    <h3>Entiende cada corrección</h3>
                    <p>
                      Compara tus palabras y explora las explicaciones, con
                      preguntas de escritura según tu nivel.
                    </p>
                  </div>
                </li>
                <li>
                  <CalendarDays size={23} />
                  <div>
                    <h3>Vuelve a tus historias</h3>
                    <p>
                      Encuentra tus entradas y los temas que aparecen en tus
                      correcciones. Tus palabras cuentan tu recorrido.
                    </p>
                  </div>
                </li>
              </ol>
              <p className="honest-caption">
                El corrector actual reconoce patrones concretos. No revisa todo
                el contexto ni determina tu nivel de inglés.
              </p>
            </section>
            <section className="closing section-shell">
              <BookOpen size={32} />
              <div>
                <h2>Empieza con algo de hoy.</h2>
                <p>No necesitas una historia extraordinaria para escribir.</p>
              </div>
              <button className="button dark" onClick={newEntry}>
                Escribir mi primera entrada
                <ArrowRight size={18} />
              </button>
            </section>
          </>
        ) : (
          <div className={`workspace-shell ${!profile ? "auth-shell" : ""}`}>
            <div className="workspace-top">
              {profile && (
                <button
                  className="text-link"
                  disabled={saving}
                  onClick={async () => {
                    try {
                      flushDraft();
                      await api.logout();
                      setProfile(null);
                      setEntries([]);
                      setSelected(null);
                      setText("");
                      setEditing(undefined);
                      setError("");
                      setNotice("");
                      go("escribir");
                    } catch (error) {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "No pudimos cerrar la sesión.",
                      );
                    }
                  }}
                >
                  Cerrar sesión
                </button>
              )}
              <span className="workspace-mode">
                {api.apiMode ? <Cloud size={15} /> : <HardDrive size={15} />}{" "}
                {api.apiMode
                  ? "Tu diario privado · sincronizado"
                  : "Modo demo · datos en este navegador"}
              </span>
              <label className="level-select">
                Mi nivel
                <select
                  aria-label="Mi nivel de inglés"
                  value={level}
                  disabled={saving}
                  onChange={(e) => void changeLevel(e.target.value as Level)}
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l} — {levelGuide[l].name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} />
              </label>
            </div>
            {(view === "progreso" || !profile) && <LevelGuide level={level} />}
            {error && (
              <div className="error-banner" role="alert">
                <AlertCircle size={19} />
                <div>
                  <strong>Algo no salió como esperábamos.</strong>
                  <p>{error}</p>
                </div>
                <button
                  className="icon-button"
                  aria-label="Cerrar error"
                  onClick={() => setError("")}
                >
                  <X size={17} />
                </button>
              </div>
            )}
            {view === "acerca" ? (
              <section className="about-view">
                <h1>
                  Antes de aprender
                  <br />
                  <em>otras palabras, las mías.</em>
                </h1>
                <p>
                  Este proyecto nació de algo personal: escribir un diario para
                  desahogarme. Para sacar lo que siento en el día, sea bueno o
                  malo.
                </p>
                <p>
                  Me gustó la idea, pero pensé: ¿y si además aprovecho para
                  aprender algo? Mi inglés es básico y estoy tratando de
                  mejorarlo. Uní ambas cosas: un lugar donde contar mi día,
                  entender mis errores y volver a leer mi historia.
                </p>
                <p>
                  No se trata de escribir perfecto. Se trata de seguir
                  escribiendo.
                </p>
                <span className="signature">Cathe</span>
                <div className="honest-note">
                  <strong>Una aplicación que también está aprendiendo.</strong>
                  <p>
                    Esta versión utiliza reglas de corrección limitadas. Su
                    puntaje es orientativo. La versión conectada guarda tus
                    entradas en una cuenta privada. La demo guarda los datos en
                    este navegador.
                  </p>
                </div>
                <button className="button dark" onClick={newEntry}>
                  Ahora, tu historia
                  <ArrowUpRight size={17} />
                </button>
              </section>
            ) : !profile ? (
              <AuthPanel
                checkingSession={authLoading}
                onBegin={() => {
                  sessionCheck.current?.abort();
                  setAuthLoading(false);
                }}
                onError={setError}
                onProfile={(p) => {
                  setProfile(p);
                  setLevel(p.nivel);
                  setSelected(null);
                  const draft = readDraft(p.idUsuario);
                  setText(draft.text);
                  setDate(draft.date);
                  setEditing(draft.editing);
                  setError("");
                  setNotice("Tu diario está listo.");
                }}
              />
            ) : view === "escribir" ? (
              <>
                <div className="page-title">
                  <div>
                    <p className="greeting">
                      Hola, {profile.nombre}. ¿Qué te gustaría recordar?
                    </p>
                    <h1>
                      {selected
                        ? "Tu historia, con algo nuevo."
                        : "Un momento para tu día."}
                    </h1>
                  </div>
                  <span className="date-display">
                    <CalendarDays size={16} />
                    {dateLabel(localDate())}
                  </span>
                </div>
                {selected ? (
                  <section className="result-view">
                    <div className="result-toolbar">
                      <button className="text-link" onClick={newEntry}>
                        <ArrowLeft size={16} />
                        Escribir otra entrada
                      </button>
                      <span>
                        <CheckCheck size={15} />
                        Guardado en tu historial
                      </span>
                    </div>
                    <div className="result-columns">
                      <article className="result-paper">
                        <div className="result-tabs">
                          <button
                            className={tab === "corregido" ? "selected" : ""}
                            aria-pressed={tab === "corregido"}
                            onClick={() => setTab("corregido")}
                          >
                            Texto corregido
                          </button>
                          <button
                            className={tab === "original" ? "selected" : ""}
                            aria-pressed={tab === "original"}
                            onClick={() => setTab("original")}
                          >
                            Tu original
                          </button>
                          <button
                            className="icon-button"
                            onClick={() => void copyText()}
                            aria-label="Copiar texto corregido"
                          >
                            {copied ? <Check size={17} /> : <Copy size={17} />}
                          </button>
                        </div>
                        <p className="entry-date">
                          {dateLabel(selected.fecha)} · {selected.nivel}
                        </p>
                        <InlineCorrections
                          entry={selected}
                          original={tab === "original"}
                          active={activeCorrection}
                          onSelect={(index) => {
                            setActiveCorrection(index);
                            const element = document.getElementById(
                              `correction-${index}`,
                            );
                            element?.focus({ preventScroll: true });
                            element?.scrollIntoView({
                              block: "nearest",
                              behavior: "instant",
                            });
                          }}
                        />
                        <div className="paper-actions">
                          <span>
                            {wordCount(selected.textoOriginal)} palabras
                          </span>
                          <button
                            className="text-link"
                            onClick={() => edit(selected)}
                          >
                            Editar entrada
                            <Pencil size={14} />
                          </button>
                        </div>
                      </article>
                      <aside className="result-summary">
                        <div className="score">
                          <span>
                            <BookOpen size={24} />
                          </span>
                          <div>
                            <h3>
                              {selected.correcciones.length
                                ? "Un paso más en tu camino."
                                : "Sigue encontrando tu voz."}
                            </h3>
                            <p>
                              {selected.correcciones.length}{" "}
                              {selected.correcciones.length === 1
                                ? "cambio para explorar"
                                : "cambios para explorar"}
                            </p>
                          </div>
                        </div>
                        <p className="score-note">
                          Referencia del corrector: {selected.puntaje}/100. No
                          mide tu nivel de inglés.
                        </p>
                        <h3>Qué corregimos y por qué</h3>
                        {!selected.correcciones.length ? (
                          <p className="small-muted">
                            Las reglas no detectaron errores. Esto no garantiza
                            que el texto sea perfecto.
                          </p>
                        ) : (
                          selected.correcciones.map((c, i) => (
                            <div
                              className={`correction ${activeCorrection === i ? "is-active" : ""}`}
                              key={i}
                              id={`correction-${i}`}
                              tabIndex={-1}
                            >
                              <span className="category-tag">
                                {c.categoriaTitulo}
                              </span>
                              <p className="change">
                                <del>{c.fragmentoOriginal}</del>
                                <ArrowRight size={13} />
                                <strong>{c.fragmentoCorregido}</strong>
                              </p>
                              <p>{c.explicacion}</p>
                            </div>
                          ))
                        )}
                        {selected.sugerenciasVocabulario?.length > 0 && (
                          <>
                            <h3>Palabras para explorar</h3>
                            {selected.sugerenciasVocabulario.map((s, i) => (
                              <div className="correction" key={i}>
                                <p className="change">
                                  {s.expresionOriginal}
                                  <ArrowRight size={13} />
                                  <strong>{s.alternativa}</strong>
                                </p>
                                <p>{s.explicacion}</p>
                              </div>
                            ))}
                          </>
                        )}
                      </aside>
                    </div>
                  </section>
                ) : (
                  <section className="editor-layout">
                    <form className="editor-paper" onSubmit={submit}>
                      <div className="editor-toolbar">
                        <span>
                          <PenLine size={16} />
                          {editing ? "Editar mi entrada" : "Una nueva página"}
                        </span>
                        <input
                          type="date"
                          aria-label="Fecha de la entrada"
                          required
                          value={date}
                          max={localDate()}
                          onChange={(e) => setDate(e.target.value)}
                          onInput={(e) => setDate(e.currentTarget.value)}
                        />
                      </div>
                      <label htmlFor="diary-text" className="sr-only">
                        Escribe tu día en inglés
                      </label>
                      <textarea
                        ref={editor}
                        id="diary-text"
                        lang="en"
                        spellCheck={false}
                        placeholder="Today, I feel…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={10000}
                        required
                        disabled={saving}
                      />
                      <div className="editor-meta">
                        <span>
                          {wordCount(text)} palabras{" "}
                          <span className="meta-divider">·</span> {text.length}
                          /10 000
                        </span>
                        <span>
                          {draftState && (
                            <>
                              <CheckCheck size={13} />
                              {draftState}
                            </>
                          )}
                        </span>
                      </div>
                      <div className="editor-bottom">
                        <p>
                          Tu voz primero.
                          <br />
                          <span>La gramática, la vemos después.</span>
                        </p>
                        <button
                          className="button dark"
                          disabled={!text.trim() || saving}
                        >
                          {saving ? (
                            <>
                              <LoaderCircle className="spin" size={17} />
                              Corrigiendo…
                            </>
                          ) : (
                            <>
                              {editing
                                ? "Corregir y actualizar"
                                : "Corregir mi día"}
                              <ArrowUpRight size={17} />
                            </>
                          )}
                        </button>
                      </div>
                      {editing && (
                        <button
                          type="button"
                          className="text-link cancel-edit"
                          onClick={() => {
                            setEditing(undefined);
                            setText("");
                          }}
                        >
                          Cancelar edición
                        </button>
                      )}
                    </form>
                    <aside className="writing-companion">
                      <h2>Una idea para escribir</h2>
                      <p>
                        {level} · {practice[level].focus}
                      </p>
                      <div className="writing-prompt">
                        <p lang="en">
                          {
                            practice[level].prompts[
                              prompt % practice[level].prompts.length
                            ]
                          }
                        </p>
                        <button
                          className="text-link light"
                          onClick={() => setPrompt(prompt + 1)}
                        >
                          Otra idea
                          <ArrowRight size={15} />
                        </button>
                      </div>
                      <div className="companion-bottom">
                        <LevelGuide level={level} />
                        <p>
                          Tu diario es personal. Escribe sin buscar la frase
                          perfecta.
                        </p>
                      </div>
                    </aside>
                  </section>
                )}
                {!selected && entries.length > 0 && (
                  <section className="recent-entries">
                    <div className="section-title">
                      <h2>Vuelve a tus palabras</h2>
                      <a href="#historial">Ver todo el historial</a>
                    </div>
                    {entries.slice(0, 3).map((entry) => (
                      <button
                        key={entry.idEntrada}
                        onClick={() => {
                          setSelected(entry);
                          setTab("corregido");
                          window.scrollTo({ top: 0 });
                        }}
                      >
                        <time dateTime={entry.fecha}>
                          {dateLabel(entry.fecha)}
                        </time>
                        <span lang="en">
                          {entry.textoOriginal.slice(0, 110)}
                          {entry.textoOriginal.length > 110 ? "…" : ""}
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </section>
                )}
              </>
            ) : view === "historial" ? (
              <>
                <div className="page-title">
                  <div>
                    <h1>Tus historias, a mano.</h1>
                    <p className="greeting">
                      Pequeñas historias. Un camino que continúa.
                    </p>
                  </div>
                  <button className="button dark" onClick={newEntry}>
                    <Plus size={17} />
                    Nueva entrada
                  </button>
                </div>
                <div className="history-tools">
                  <label className="search-field">
                    <Search size={17} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Busca una palabra, un recuerdo…"
                      aria-label="Buscar en el historial"
                    />
                  </label>
                  <select
                    aria-label="Filtrar historial por nivel"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="todos">Todos los niveles</option>
                    {levels.map((l) => (
                      <option key={l} value={l}>
                        {l} — {levelGuide[l].name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="text-link"
                    onClick={exportEntries}
                    disabled={!entries.length}
                  >
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
                {loading ? (
                  <div className="empty-state" role="status">
                    <LoaderCircle className="spin" />
                    <p>Cargando tus historias…</p>
                  </div>
                ) : !filtered.length ? (
                  <div className="empty-state">
                    <BookOpen size={38} strokeWidth={1} />
                    <h2>
                      {entries.length
                        ? "No encontramos esas palabras."
                        : "Tu historia empieza con una línea."}
                    </h2>
                    <p>
                      {entries.length
                        ? "Prueba otra búsqueda o cambia el filtro."
                        : "Cuando escribas tu primera entrada, la encontrarás aquí."}
                    </p>
                    <button
                      className="button outline"
                      onClick={
                        entries.length
                          ? () => {
                              setSearch("");
                              setFilter("todos");
                            }
                          : newEntry
                      }
                    >
                      {entries.length ? "Limpiar filtros" : "Escribir mi día"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="history-list">
                    {filtered.map((e) => (
                      <article className="history-entry" key={e.idEntrada}>
                        <button
                          className="entry-main"
                          onClick={() => {
                            setSelected(e);
                            setTab("corregido");
                            go("escribir");
                          }}
                        >
                          <div className="entry-datestamp">
                            <span>
                              {new Date(e.fecha + "T12:00:00").getDate()}
                            </span>
                            <small>
                              {new Date(
                                e.fecha + "T12:00:00",
                              ).toLocaleDateString("es-PE", {
                                month: "short",
                                year: "numeric",
                              })}
                            </small>
                          </div>
                          <div>
                            <span className="entry-level">
                              {e.nivel} <span>·</span>{" "}
                              {wordCount(e.textoOriginal)} palabras
                            </span>
                            <h3 lang="en">
                              {e.textoOriginal.slice(0, 65)}
                              {e.textoOriginal.length > 65 ? "…" : ""}
                            </h3>
                            <p lang="en">{e.textoCorregido.slice(0, 130)}</p>
                          </div>
                          <span className="entry-score">
                            {e.correcciones.length}
                            <small>
                              {e.correcciones.length === 1
                                ? "cambio"
                                : "cambios"}
                            </small>
                            <ArrowUpRight size={18} />
                          </span>
                        </button>
                        <div className="entry-actions">
                          {pendingDelete === e.idEntrada ? (
                            <>
                              <span>¿Eliminar esta entrada?</span>
                              <button
                                className="danger-text"
                                disabled={saving}
                                onClick={() => void remove(e.idEntrada)}
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => setPendingDelete(undefined)}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                aria-label={`Editar entrada del ${dateLabel(e.fecha)}`}
                                onClick={() => edit(e)}
                              >
                                <Pencil size={14} />
                                Editar
                              </button>
                              <button
                                aria-label={`Eliminar entrada del ${dateLabel(e.fecha)}`}
                                onClick={() => setPendingDelete(e.idEntrada)}
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="page-title">
                  <div>
                    <h1>
                      Lo pequeño
                      <br />
                      <em>también es progreso.</em>
                    </h1>
                    <p className="greeting">
                      Sin compararte. Solo acompañarte.
                    </p>
                  </div>
                  <BarChart3 size={35} strokeWidth={1} />
                </div>
                <div className="metrics">
                  <div>
                    <span>Entradas escritas</span>
                    <strong>
                      {entries.length.toString().padStart(2, "0")}
                    </strong>
                    <p>Veces que encontraste un momento para ti.</p>
                  </div>
                  <div>
                    <span>Palabras que cuentan</span>
                    <strong>{totalWords.toLocaleString("es-PE")}</strong>
                    <p>Tu historia, una palabra a la vez.</p>
                  </div>
                  <div>
                    <span>Puntaje promedio</span>
                    <strong>
                      {average}
                      <small>/100</small>
                    </strong>
                    <p>Referencia del corrector, no un nivel MCER.</p>
                  </div>
                </div>
                <div className="progress-layout">
                  <section className="progress-chart">
                    <div className="section-title">
                      <h2>Tu camino, entrada a entrada.</h2>
                      <span>Últimas 12 entradas</span>
                    </div>
                    {entries.length < 2 ? (
                      <div className="empty-state compact">
                        <PenLine size={26} strokeWidth={1} />
                        <p>Con dos entradas podrás ver aquí tu recorrido.</p>
                        <button className="text-link" onClick={newEntry}>
                          Escribir una nueva página
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <ProgressChart entries={entries} />
                    )}
                    <p className="score-note">
                      El puntaje depende de las reglas y de la longitud del
                      texto. Una subida no demuestra por sí sola una mejora de
                      nivel.
                    </p>
                  </section>
                  <section className="topic-section">
                    <h2>Un poco más de práctica.</h2>
                    <p className="small-muted">
                      Categorías que aparecen en tus correcciones.
                    </p>
                    {!topicList.length ? (
                      <p className="small-muted">
                        Aún no hay correcciones para agrupar.
                      </p>
                    ) : (
                      topicList.map(([category, count]) => (
                        <div className="topic-row" key={category}>
                          <div>
                            <span>{categoryNames[category]}</span>
                            <span>{count}</span>
                          </div>
                          <progress
                            value={count}
                            max={Math.max(...topicList.map((x) => x[1]))}
                            aria-label={`${categoryNames[category]}: ${count} correcciones`}
                          />
                        </div>
                      ))
                    )}
                  </section>
                </div>
              </>
            )}
            <p className="workspace-footnote">
              {api.apiMode
                ? "Tus entradas se guardan en tu cuenta. El borrador permanece en este dispositivo."
                : "Tus entradas de demo se guardan en este navegador. Exporta una copia para conservarlas."}
            </p>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <a href="#inicio" className="wordmark">
          diario<span className="brand-dot">.</span>
        </a>
        <p>Aprender inglés. Encontrarte en el camino.</p>
        <div>
          <a href="#acerca">
            Hecho con una historia real
            <ArrowUpRight size={13} />
          </a>
          <span>© {new Date().getFullYear()} Diario de Idiomas</span>
        </div>
      </footer>
    </div>
  );
}

function ProgressChart({ entries }: { entries: Entry[] }) {
  const data = entries.slice(0, 12).reverse();
  const width = 660,
    height = 200;
  const points = data.map((entry, i) => ({
    x: 35 + (i * (width - 70)) / (data.length - 1),
    y: height - 28 - (entry.puntaje * (height - 55)) / 100,
    entry,
  }));
  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Puntaje orientativo de las últimas entradas"
      >
        <title>Puntaje por entrada, de 0 a 100</title>
        {[0, 50, 100].map((n) => (
          <g key={n}>
            <line
              x1="35"
              x2="635"
              y1={height - 28 - (n * (height - 55)) / 100}
              y2={height - 28 - (n * (height - 55)) / 100}
              stroke="var(--line)"
              strokeDasharray="3 5"
            />
            <text
              x="3"
              y={height - 24 - (n * (height - 55)) / 100}
              fontSize="11"
              fill="var(--muted)"
            >
              {n}
            </text>
          </g>
        ))}
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        />
        {points.map((p) => (
          <g key={p.entry.idEntrada}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="var(--accent)"
              stroke="white"
              strokeWidth="2"
            >
              <title>
                {dateLabel(p.entry.fecha)}: {p.entry.puntaje}/100
              </title>
            </circle>
          </g>
        ))}
      </svg>
      <figcaption>
        <span>{dateLabel(data[0].fecha)}</span>
        <span>{dateLabel(data[data.length - 1].fecha)}</span>
      </figcaption>
      <details>
        <summary>Ver datos del gráfico</summary>
        <ul>
          {data.map((e) => (
            <li key={e.idEntrada}>
              {dateLabel(e.fecha)}: {e.puntaje}/100
            </li>
          ))}
        </ul>
      </details>
    </figure>
  );
}
