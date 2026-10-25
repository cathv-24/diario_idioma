// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { Profile } from "../lib/types";

const apiMock = vi.hoisted(() => ({
  loadProfile: vi.fn(),
  login: vi.fn(),
  listEntries: vi.fn(),
}));
vi.mock("../lib/api", () => ({ apiMode: true, ...apiMock }));
import App from "../App";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("sesión inicial y acceso concurrente", () => {
  it("sigue el dispositivo hasta elegir un tema y recuerda esa elección al volver", async () => {
    location.hash = "#inicio";
    apiMock.loadProfile.mockResolvedValue(null);
    const changes = new Set<(event: { matches: boolean }) => void>();
    const media = {
      matches: true,
      addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => changes.add(listener),
      removeEventListener: (_: string, listener: (event: { matches: boolean }) => void) => changes.delete(listener),
    };
    vi.stubGlobal("matchMedia", () => media);
    const first = render(<App />);
    expect(screen.getByRole("button", { name: "Activar modo claro" }).getAttribute("aria-pressed")).toBe("true");
    expect(localStorage.getItem("diario.theme")).toBeNull();
    await act(async () => { changes.forEach((change) => change({ matches: false })); });
    fireEvent.click(screen.getByRole("button", { name: "Activar modo oscuro" }));
    expect(localStorage.getItem("diario.theme")).toBe("dark");
    await act(async () => { changes.forEach((change) => change({ matches: false })); });
    expect(screen.getByRole("button", { name: "Activar modo claro" })).toBeTruthy();
    first.unmount();
    expect(changes.size).toBe(0);
    media.matches = false;
    render(<App />);
    expect(screen.getByRole("button", { name: "Activar modo claro" })).toBeTruthy();
  });

  it("permite entrar mientras la sesión inicial tarda y descarta su respuesta antigua", async () => {
    location.hash = "#escribir";
    let finishCheck!: (profile: Profile) => void;
    apiMock.loadProfile.mockImplementation(
      () =>
        new Promise<Profile>((resolve) => {
          finishCheck = resolve;
        }),
    );
    const current: Profile = {
      idUsuario: 2,
      nombre: "Cuenta nueva",
      email: "nueva@example.com",
      nivel: "A2",
    };
    apiMock.login.mockResolvedValue(current);
    apiMock.listEntries.mockResolvedValue([]);
    render(<App />);
    expect(screen.getByLabelText("Correo electrónico")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("Comprobando");
    const signal = apiMock.loadProfile.mock.calls[0][0] as AbortSignal;
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: current.email },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "clave-de-prueba-local" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Entrar a mi diario" })
        .closest("form")!,
    );
    expect(await screen.findByText(/Hola, Cuenta nueva/)).toBeTruthy();
    expect(signal.aborted).toBe(true);
    await act(async () => {
      finishCheck({ ...current, idUsuario: 1, nombre: "Sesión anterior" });
    });
    expect(screen.queryByText(/Hola, Sesión anterior/)).toBeNull();
    expect(screen.getByText(/Hola, Cuenta nueva/)).toBeTruthy();
    expect(apiMock.listEntries).toHaveBeenCalledWith(current);
  });
});
