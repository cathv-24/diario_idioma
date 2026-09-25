import { Routes } from '@angular/router';
import { EscribirComponent } from './paginas/escribir/escribir.component';
import { HistorialComponent } from './paginas/historial/historial.component';

export const routes: Routes = [
  { path: '', component: EscribirComponent },
  { path: 'historial', component: HistorialComponent },
  { path: '**', redirectTo: '' },
];
