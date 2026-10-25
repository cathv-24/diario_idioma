import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LoaderCircle, BookOpen } from "lucide-react";
import * as api from "../lib/api";
import { levels } from "../lib/types";
import type { Level, Profile } from "../lib/types";
import guide from "../lib/levels.json";
export default function AuthPanel({
  onProfile,
  onError,
  checkingSession = false,
  onBegin,
}: {
  onProfile: (profile: Profile) => void;
  onError: (message: string) => void;
  checkingSession?: boolean;
  onBegin?: () => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    if (!busy) return;
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [busy]);
  const [level, setLevel] = useState<Level>("A2");
  const register = !api.apiMode || mode === "register";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    onBegin?.();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    onError("");
    try {
      const email = String(data.get("email")),
        password = String(data.get("password") || "");
      const result = register
        ? await api.createProfile(
            String(data.get("nombre")),
            email,
            level,
            password,
          )
        : await api.login(email, password);
      onProfile(result);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "No pudimos abrir tu diario.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="onboarding">
      <div>
        <BookOpen size={28} />
        <h1>
          Tu diario,
          <br />
          <em>contigo.</em>
        </h1>
        <p>
          {api.apiMode
            ? "Entra a tu cuenta y encuentra tus entradas desde cualquier dispositivo."
            : "Prueba el diario en este navegador."}
        </p>
        <p className="small-muted">
          {api.apiMode
            ? "Cada cuenta tiene su propio historial privado. El borrador permanece en el dispositivo donde escribes."
            : "La demo guarda los datos solo en este navegador."}
        </p>
      </div>
      <div>
        {api.apiMode && (
          <div
            className="auth-switch"
            role="group"
            aria-label="Acceso a tu diario"
          >
            <button
              type="button"
              disabled={busy}
              aria-pressed={!register}
              onClick={() => {
                setMode("login");
                onError("");
              }}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              disabled={busy}
              aria-pressed={register}
              onClick={() => {
                setMode("register");
                onError("");
              }}
            >
              Crear cuenta
            </button>
          </div>
        )}
        <form onSubmit={submit}>
          {api.apiMode && (
            <p className="session-status" role="status">
              {checkingSession
                ? "Comprobando si ya tienes una sesión abierta…"
                : null}
            </p>
          )}
          {register && (
            <label>
              Tu nombre
              <input
                name="nombre"
                required
                maxLength={80}
                autoComplete="given-name"
                placeholder="¿Cómo te llamamos?"
                disabled={busy}
              />
            </label>
          )}
          <label>
            Correo electrónico
            <input
              name="email"
              type="email"
              required
              maxLength={100}
              autoComplete="email"
              disabled={busy}
            />
          </label>
          {api.apiMode && (
            <label>
              Contraseña
              <input
                name="password"
                type="password"
                required
                minLength={register ? 12 : 1}
                maxLength={64}
                autoComplete={register ? "new-password" : "current-password"}
                disabled={busy}
              />
              {register && (
                <span className="small-muted">
                  Al menos 12 caracteres. Usa una contraseña que puedas recordar
                  o guardar en tu gestor.
                </span>
              )}
            </label>
          )}
          {register && (
            <label>
              Tu nivel de inglés
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                disabled={busy}
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l} — {guide[l].name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button className="button dark" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle className="spin" size={17} />
                Abriendo tu diario…
              </>
            ) : (
              <>
                {register ? "Crear mi cuenta" : "Entrar a mi diario"}
                <ArrowRight size={17} />
              </>
            )}
          </button>
          {slow && (
            <p className="small-muted" role="status">
              El servidor está tardando en responder. Mantén esta página
              abierta; no necesitas enviar otra vez.
            </p>
          )}
          {api.apiMode && !register && (
            <p className="small-muted">
              Los perfiles de prueba anteriores no tenían contraseña. Para usar
              la versión privada, crea una cuenta nueva. La recuperación
              automática de contraseñas aún no está disponible.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
