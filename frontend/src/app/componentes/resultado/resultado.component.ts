import { Component, Input } from '@angular/core';
import { COLOR_CATEGORIA, EntradaCorregida } from '../../modelos/modelos';

@Component({
  selector: 'app-resultado',
  standalone: true,
  template: `
    @if (entrada) {
      <div class="space-y-5">
        <!-- Encabezado: puntaje + mensaje -->
        <div class="flex items-center gap-4 rounded-xl bg-white border border-slate-200 p-4">
          <div
            class="flex flex-col items-center justify-center w-16 h-16 rounded-full text-white font-bold shrink-0"
            [class]="colorPuntaje(entrada.puntaje)"
          >
            <span class="text-xl leading-none">{{ entrada.puntaje }}</span>
            <span class="text-[10px] opacity-90">/100</span>
          </div>
          <div>
            <p class="font-semibold text-slate-800">{{ entrada.mensaje }}</p>
            <p class="text-sm text-slate-500">
              {{ entrada.correcciones.length }} corrección(es) · nivel {{ entrada.nivel }}
            </p>
          </div>
        </div>

        <!-- Texto corregido -->
        <div class="rounded-xl bg-white border border-slate-200 p-4">
          <h3 class="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            Tu texto corregido
          </h3>
          <p class="text-slate-800 leading-relaxed whitespace-pre-wrap">
            {{ entrada.textoCorregido }}
          </p>
        </div>

        <!-- Correcciones detalladas -->
        @if (entrada.correcciones.length) {
          <div class="rounded-xl bg-white border border-slate-200 p-4">
            <h3 class="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">
              Qué corregimos y por qué
            </h3>
            <ul class="space-y-3">
              @for (c of entrada.correcciones; track $index) {
                <li class="border-l-2 border-slate-200 pl-3">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      class="text-xs font-medium px-2 py-0.5 rounded-full"
                      [class]="color(c.categoria)"
                      >{{ c.categoriaTitulo }}</span
                    >
                    <span class="text-sm">
                      <span class="line-through text-rose-500">{{ c.fragmentoOriginal }}</span>
                      <span class="mx-1 text-slate-400">→</span>
                      <span class="text-emerald-600 font-medium">{{ c.fragmentoCorregido }}</span>
                    </span>
                  </div>
                  <p class="text-sm text-slate-600">{{ c.explicacion }}</p>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Temas a mejorar -->
        @if (entrada.temasAMejorar.length) {
          <div class="rounded-xl bg-marca-50 border border-marca-100 p-4">
            <h3 class="text-sm font-semibold text-marca-700 mb-3 uppercase tracking-wide">
              Temas en los que estás fallando
            </h3>
            <ul class="space-y-2">
              @for (t of entrada.temasAMejorar; track t.categoria) {
                <li class="flex items-start gap-3">
                  <span
                    class="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    [class]="color(t.categoria)"
                    >{{ t.titulo }} × {{ t.cantidad }}</span
                  >
                  <p class="text-sm text-slate-600">{{ t.consejo }}</p>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    }
  `,
})
export class ResultadoComponent {
  @Input() entrada: EntradaCorregida | null = null;

  color(categoria: EntradaCorregida['correcciones'][number]['categoria']): string {
    return COLOR_CATEGORIA[categoria] ?? 'bg-slate-100 text-slate-700';
  }

  colorPuntaje(puntaje: number): string {
    if (puntaje >= 80) return 'bg-emerald-500';
    if (puntaje >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  }
}
