import { Component, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DiarioService } from '../../servicios/diario.service';
import { EstadoService } from '../../servicios/estado.service';
import { EntradaCorregida } from '../../modelos/modelos';
import { ResultadoComponent } from '../../componentes/resultado/resultado.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ResultadoComponent, DatePipe],
  template: `
    <section class="space-y-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Tu historial</h1>
        <p class="text-slate-500">Revisa tus entradas anteriores y cómo has ido mejorando.</p>
      </div>

      @if (cargando) {
        <p class="text-slate-400">Cargando...</p>
      } @else if (!entradas.length) {
        <div class="rounded-xl bg-white border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Todavía no has escrito ninguna entrada. ¡Empieza en la pestaña <strong>Escribir</strong>!
        </div>
      } @else {
        <div class="space-y-3">
          @for (e of entradas; track e.idEntrada) {
            <div class="rounded-xl bg-white border border-slate-200 overflow-hidden">
              <button
                (click)="alternar(e.idEntrada)"
                class="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left"
              >
                <span
                  class="flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold shrink-0"
                  [class]="colorPuntaje(e.puntaje)"
                  >{{ e.puntaje }}</span
                >
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-slate-500">{{ e.fechaCreacion | date: 'medium' }}</p>
                  <p class="truncate text-slate-800">{{ e.textoOriginal }}</p>
                </div>
                <span class="text-slate-400 text-sm">{{ abierta === e.idEntrada ? '▲' : '▼' }}</span>
              </button>

              @if (abierta === e.idEntrada) {
                <div class="border-t border-slate-100 p-4 bg-slate-50">
                  <app-resultado [entrada]="e" />
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class HistorialComponent {
  entradas: EntradaCorregida[] = [];
  cargando = false;
  abierta: number | null = null;

  constructor(
    private diario: DiarioService,
    private estado: EstadoService,
  ) {
    // Carga el historial cuando el usuario esté disponible (y al cambiar de nivel)
    effect(() => {
      const u = this.estado.usuario();
      if (u) {
        this.cargar(u.idUsuario);
      }
    });
  }

  private cargar(idUsuario: number): void {
    this.cargando = true;
    this.diario.historial(idUsuario).subscribe({
      next: (data) => {
        this.entradas = data;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  alternar(id: number): void {
    this.abierta = this.abierta === id ? null : id;
  }

  colorPuntaje(puntaje: number): string {
    if (puntaje >= 80) return 'bg-emerald-500';
    if (puntaje >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  }
}
