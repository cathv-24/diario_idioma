import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EstadoService } from './servicios/estado.service';
import { NIVELES, NivelIngles } from './modelos/modelos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div class="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <a routerLink="/" class="flex items-center gap-2 font-bold text-marca-700 text-lg">
            <span class="text-2xl">📖</span> Diario de Idiomas
          </a>

          <nav class="flex items-center gap-1 ml-2 text-sm">
            <a
              routerLink="/"
              routerLinkActive="bg-marca-50 text-marca-700"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >Escribir</a
            >
            <a
              routerLink="/historial"
              routerLinkActive="bg-marca-50 text-marca-700"
              class="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >Historial</a
            >
          </nav>

          <div class="ml-auto flex items-center gap-2 text-sm">
            @if (estado.usuario(); as u) {
              <span class="hidden sm:inline text-slate-500">{{ u.nombre }}</span>
              <label class="text-slate-500">Nivel</label>
              <select
                class="rounded-lg border border-slate-300 px-2 py-1.5 bg-white focus:ring-2 focus:ring-marca-500 focus:outline-none"
                [ngModel]="u.nivel"
                (ngModelChange)="cambiarNivel($event)"
              >
                @for (n of niveles; track n.valor) {
                  <option [value]="n.valor">{{ n.etiqueta }}</option>
                }
              </select>
            }
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <router-outlet />
      </main>

      <footer class="text-center text-xs text-slate-400 py-4">
        Escribe tu día en inglés · corrección adaptada a tu nivel
      </footer>
    </div>
  `,
})
export class AppComponent implements OnInit {
  niveles = NIVELES;

  constructor(public estado: EstadoService) {}

  ngOnInit(): void {
    this.estado.inicializar();
  }

  cambiarNivel(nivel: NivelIngles): void {
    this.estado.cambiarNivel(nivel);
  }
}
