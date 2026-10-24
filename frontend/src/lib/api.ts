import type { Entry, Level, Profile } from "./types";
import { correctEntry } from "./corrector";
const base =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "/api" : "");
export const apiMode = Boolean(base);
export const STORAGE_KEY = "diario.v2.entries";
const PROFILE_KEY = "diario.v2.profile";
export class SessionExpiredError extends Error {}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };
    if (
      options.method &&
      !["GET", "HEAD", "OPTIONS"].includes(options.method)
    ) {
      const response = await fetch(base + "/auth/csrf", {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error("No pudimos preparar la sesión. Vuelve a intentarlo.");
      const csrf = await response.json();
      headers[csrf.headerName] = csrf.token;
    }
    const response = await fetch(base + path, {
      ...options,
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
      headers,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 && path !== "/auth/login") {
        window.dispatchEvent(new Event("diario:session-expired"));
        throw new SessionExpiredError(
          "Tu sesión terminó. Inicia sesión para continuar; tu borrador sigue en este dispositivo.",
        );
      }
      throw new Error(
        data.mensaje ||
          `No pudimos completar la solicitud (${response.status}).`,
      );
    }
    return response.status === 204 ? (undefined as T) : await response.json();
  } catch (error) {
    if (error instanceof TypeError)
      throw new Error(
        "No podemos conectar con el servidor. Tu borrador sigue aquí. Si el servicio está despertando, espera un momento y reintenta.",
      );
    if (error instanceof DOMException && error.name === "AbortError")
      throw new Error(
        "El servidor está tardando. Tu borrador sigue aquí; vuelve a intentarlo en un momento.",
      );
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
export async function login(email: string, password: string): Promise<Profile> {
  await request<void>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: email.trim().toLowerCase(),
      password,
    }),
  });
  const profile = await request<Profile>("/auth/me");
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}
export async function logout() {
  if (apiMode) await request<void>("/auth/logout", { method: "POST" });
  localStorage.removeItem(PROFILE_KEY);
}
function readLocal(): Entry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    throw new Error(
      "No pudimos leer el historial de este navegador. Exporta tus datos antes de restablecerlo.",
    );
  }
}
function saveLocal(entries: Entry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    throw new Error(
      "No hay espacio para guardar esta entrada. Exporta tu historial y libera espacio. Tu borrador sigue aquí.",
    );
  }
}
export async function loadProfile(): Promise<Profile | null> {
  if (apiMode) {
    try {
      return await request<Profile>("/auth/me");
    } catch (error) {
      if (error instanceof SessionExpiredError) return null;
      throw error;
    }
  }
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
  } catch {
    return null;
  }
}
export async function createProfile(
  nombre: string,
  email: string,
  nivel: Level,
  password?: string,
): Promise<Profile> {
  const profile = apiMode
    ? await request<Profile>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ nombre, email, nivel, password }),
      })
    : { idUsuario: 1, nombre, email, nivel };
  if (apiMode) return login(email, password || "");
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}
export async function updateLevel(
  profile: Profile,
  nivel: Level,
): Promise<Profile> {
  const result = apiMode
    ? await request<Profile>("/usuario", {
        method: "PUT",
        body: JSON.stringify({ ...profile, nivel }),
      })
    : { ...profile, nivel };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(result));
  return result;
}
export async function listEntries(profile: Profile): Promise<Entry[]> {
  const entries = apiMode
    ? await request<Entry[]>(`/entradas/${profile.idUsuario}`)
    : readLocal();
  return [...entries].sort((a, b) =>
    b.fechaCreacion.localeCompare(a.fechaCreacion),
  );
}
export async function saveEntry(
  profile: Profile,
  texto: string,
  fecha: string,
  id?: number,
): Promise<Entry> {
  if (apiMode)
    return request<Entry>(id ? `/entrada/${id}` : "/entrada", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify({ idUsuario: profile.idUsuario, texto, fecha }),
    });
  const entry = correctEntry(texto, profile.nivel, fecha, id);
  saveLocal([
    entry,
    ...readLocal().filter((e) => e.idEntrada !== entry.idEntrada),
  ]);
  return entry;
}
export async function deleteEntry(id: number): Promise<void> {
  if (apiMode) return request(`/entrada/${id}`, { method: "DELETE" });
  saveLocal(readLocal().filter((e) => e.idEntrada !== id));
}
