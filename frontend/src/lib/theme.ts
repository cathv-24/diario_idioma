export type Theme = "light" | "dark";

export function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem("diario.theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function deviceTheme(): Theme {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function initialTheme(): Theme {
  return savedTheme() ?? deviceTheme();
}
