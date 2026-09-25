import { Injectable, signal } from '@angular/core';
import { DiarioService } from './diario.service';
import { NivelIngles, Usuario } from '../modelos/modelos';

const CLAVE_NIVEL = 'diario_nivel';

/**
 * Mantiene el usuario activo de la app.
 * - Con backend: carga el usuario demo desde la API.
 * - En modo local (GitHub Pages): usa un usuario en memoria y guarda el nivel
 *   en localStorage.
 */
@Injectable({ providedIn: 'root' })
export class EstadoService {
  readonly usuario = signal<Usuario | null>(null);
  readonly cargando = signal<boolean>(false);

  constructor(private diario: DiarioService) {}

  inicializar(): void {
    if (this.diario.modoLocal) {
      this.usuario.set({
        idUsuario: 0,
        nombre: 'Tú (modo demo)',
        email: '',
        nivel: this.nivelGuardado(),
      });
      return;
    }
    this.cargando.set(true);
    this.diario.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuario.set(usuarios.length ? usuarios[0] : null);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cambiarNivel(nivel: NivelIngles): void {
    const actual = this.usuario();
    if (!actual) {
      return;
    }
    const actualizado = { ...actual, nivel };
    this.usuario.set(actualizado);

    if (this.diario.modoLocal) {
      this.guardarNivel(nivel);
      return;
    }
    this.diario.actualizarUsuario(actualizado).subscribe({
      next: (u) => this.usuario.set(u),
    });
  }

  private nivelGuardado(): NivelIngles {
    try {
      return (localStorage.getItem(CLAVE_NIVEL) as NivelIngles) || 'A2';
    } catch {
      return 'A2';
    }
  }

  private guardarNivel(nivel: NivelIngles): void {
    try {
      localStorage.setItem(CLAVE_NIVEL, nivel);
    } catch {
      // ignorar si no hay localStorage
    }
  }
}
