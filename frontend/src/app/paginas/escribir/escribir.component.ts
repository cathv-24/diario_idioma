import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiarioService } from '../../servicios/diario.service';
import { EstadoService } from '../../servicios/estado.service';
import { EntradaCorregida } from '../../modelos/modelos';
import { ResultadoComponent } from '../../componentes/resultado/resultado.component';

@Component({
  selector: 'app-escribir',
  standalone: true,
  imports: [FormsModule, ResultadoComponent],
  template: `
    <section class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">¿Cómo fue tu día?</h1>
        <p class="text-slate-500">
          Escríbelo en inglés. Te corregimos la gramática según tu nivel y te explicamos tus errores.
        </p>
      </div>

      <div class="rounded-xl bg-white border border-slate-200 p-4">
        <textarea
          [(ngModel)]="texto"
          rows="8"
          [disabled]="enviando"
          placeholder="Today I woke up early and i goed to the gym..."
          class="w-full resize-y rounded-lg border border-slate-300 p-3 focus:ring-2 focus:ring-marca-500 focus:outline-none leading-relaxed"
        ></textarea>

        <div class="flex items-center justify-between mt-3">
          <span class="text-xs text-slate-400">{{ contarPalabras() }} palabras</span>
          <button
            (click)="corregir()"
            [disabled]="enviando || !texto.trim() || !estado.usuario()"
            class="px-5 py-2 rounded-lg bg-marca-600 text-white font-medium hover:bg-marca-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ enviando ? 'Corrigiendo...' : 'Corregir mi día' }}
          </button>
        </div>
      </div>

      @if (error) {
        <div class="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm">
          {{ error }}
        </div>
      }

      <app-resultado [entrada]="resultado" />
    </section>
  `,
})
export class EscribirComponent {
  texto = '';
  enviando = false;
  error = '';
  resultado: EntradaCorregida | null = null;

  constructor(
    private diario: DiarioService,
    public estado: EstadoService,
  ) {}

  contarPalabras(): number {
    const t = this.texto.trim();
    return t ? t.split(/\s+/).length : 0;
  }

  corregir(): void {
    const usuario = this.estado.usuario();
    if (!usuario || !this.texto.trim()) {
      return;
    }
    this.enviando = true;
    this.error = '';
    this.diario
      .crearEntrada({ idUsuario: usuario.idUsuario, texto: this.texto }, usuario.nivel)
      .subscribe({
        next: (r) => {
          this.resultado = r;
          this.enviando = false;
        },
        error: () => {
          this.error =
            'No pudimos conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8080.';
          this.enviando = false;
        },
      });
  }
}
