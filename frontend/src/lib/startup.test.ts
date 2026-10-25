import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
  vi.resetModules();
});

describe("apertura del diario con el servidor lento", () => {
  it("muestra el acceso desde el primer render, sin esperar la comprobación de sesión", async () => {
    vi.stubEnv("VITE_API_URL", "/api");
    vi.stubGlobal("location", { hash: "#escribir" });
    vi.stubGlobal("localStorage", { getItem: () => null });
    const { default: App } = await import("../App");
    const html = renderToString(createElement(App));
    expect(html).toContain("Correo electrónico");
    expect(html).toContain("Contraseña");
    expect(html).toContain("Comprobando si ya tienes una sesión abierta");
    expect(html).not.toContain("Abriendo tu diario…");
  });

  it("permite cancelar la comprobación pendiente antes de iniciar un acceso nuevo", async () => {
    vi.stubEnv("VITE_API_URL", "/api");
    let requestSignal: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            requestSignal = options.signal;
            options.signal.addEventListener(
              "abort",
              () => reject(new DOMException("Cancelled", "AbortError")),
              { once: true },
            );
          }),
      ),
    );
    const { loadProfile } = await import("./api");
    const controller = new AbortController();
    const result = loadProfile(controller.signal);
    controller.abort();
    await expect(result).rejects.toThrow();
    expect(requestSignal?.aborted).toBe(true);
  });

  it("limita la comprobación inicial a 15 segundos aunque el servidor no responda", async () => {
    vi.useFakeTimers();
    vi.stubEnv("VITE_API_URL", "/api");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener(
              "abort",
              () => reject(new DOMException("Timed out", "AbortError")),
              { once: true },
            );
          }),
      ),
    );
    const { loadProfile } = await import("./api");
    const result = expect(loadProfile()).rejects.toThrow(
      "El servidor está tardando",
    );
    await vi.advanceTimersByTimeAsync(15000);
    await result;
  });
});
