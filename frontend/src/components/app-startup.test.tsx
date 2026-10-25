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
});

describe("sesión inicial y acceso concurrente", () => {
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
