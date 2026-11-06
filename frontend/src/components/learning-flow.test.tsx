// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
const apiMock = vi.hoisted(() => ({ loadLearning: vi.fn(), saveLearning: vi.fn() }));
vi.mock("../lib/api", () => ({ apiMode: true, ...apiMock }));
import AuthPanel from "./AuthPanel";
import LearningHub from "./LearningHub";
import { placementQuestions } from "../lib/placement";
const profile = { idUsuario: 42, nombre: "Prueba", email: "test@example.com", nivel: "A2" as const };
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it("conserva el formulario al hacer la orientación y aplica el nivel sugerido", () => {
  render(<AuthPanel onProfile={vi.fn()} onError={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
  fireEvent.change(screen.getByLabelText("Tu nombre"), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "ana@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /No sé mi nivel/ }));
  for (let i = 0; i < placementQuestions.length; i++) {
    fireEvent.click(screen.getByRole("button", { name: placementQuestions[i].choices[placementQuestions[i].answer] }));
    fireEvent.click(screen.getByRole("button", { name: i === placementQuestions.length - 1 ? /Ver orientación/ : /Siguiente/ }));
  }
  fireEvent.click(screen.getByRole("button", { name: /Continuar con B1/ }));
  expect((screen.getByLabelText(/Tu nombre/) as HTMLInputElement).value).toBe("Ana");
  expect((screen.getByLabelText(/Tu nivel de inglés/) as HTMLSelectElement).value).toBe("B1");
});

it("guarda una lectura correcta y lleva su propuesta al diario", async () => {
  apiMock.loadLearning.mockResolvedValue({ unidadActual: "e7", lecturasCompletadas: [], palabrasGuardadas: [] });
  apiMock.saveLearning.mockImplementation((_profile, state) => Promise.resolve(state));
  const write = vi.fn();
  render(<LearningHub profile={profile} entries={[]} onWrite={write} />);
  await screen.findByText("A slower afternoon");
  fireEvent.click(screen.getByLabelText("They felt tired"));
  fireEvent.click(screen.getByRole("button", { name: "Comprobar mi lectura" }));
  await screen.findByText(/Lectura completada y guardada/);
  expect(apiMock.saveLearning.mock.calls[0][1].lecturasCompletadas).toContain("e7");
  fireEvent.click(screen.getByRole("button", { name: /Llevar esta idea/ }));
  expect(write).toHaveBeenCalledWith("What did you do to take care of yourself today?");
});

it("un fallo al cargar el avance impide sobrescribirlo con valores iniciales", async () => {
  apiMock.loadLearning.mockRejectedValue(new Error("Sin conexión"));
  render(<LearningHub profile={profile} entries={[]} onWrite={vi.fn()} />);
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Sin conexión"));
  expect(screen.queryByRole("button", { name: "Comprobar mi lectura" })).toBeNull();
  expect(apiMock.saveLearning).not.toHaveBeenCalled();
});
