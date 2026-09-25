import { Injectable, signal } from '@angular/core';
import { DiarioService } from './diario.service';
import { NivelIngles, Usuario } from '../modelos/modelos';

/**
 * Mantiene el usuario activo de la app (para la demo trabajamos con un solo usuario).
 * Expone senales para que los componentes reaccionen a los cambios de nivel.
 */
@Injectable({ providedIn: 'root' })
export class EstadoService {
  readonly usuario = signal<Usuario | null>(null);
  readonly cargando = signal<boolean>(false);

  constructor(private diario: DiarioService) {}

  /** Carga el primer usuario disponible (el usuario demo creado por el backend). */
  inicializar(): void {
    this.cargando.set(true);
    this.diario.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuario.set(usuarios.length ? usuarios[0] : null);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  /** Cambia el nivel del usuario y lo persiste en el backend. */
  cambiarNivel(nivel: NivelIngles): void {
    const actual = this.usuario();
    if (!actual) {
      return;
    }
    const actualizado = { ...actual, nivel };
    this.usuario.set(actualizado);
    this.diario.actualizarUsuario(actualizado).subscribe({
      next: (u) => this.usuario.set(u),
    });
  }
}
