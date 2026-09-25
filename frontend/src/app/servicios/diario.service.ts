import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EntradaCorregida,
  EntradaRequest,
  Usuario,
} from '../modelos/modelos';

@Injectable({ providedIn: 'root' })
export class DiarioService {
  private readonly base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Usuarios
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/usuarios`);
  }

  buscarUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/usuario/${id}`);
  }

  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/usuario`, usuario);
  }

  // Entradas del diario
  crearEntrada(request: EntradaRequest): Observable<EntradaCorregida> {
    return this.http.post<EntradaCorregida>(`${this.base}/entrada`, request);
  }

  historial(idUsuario: number): Observable<EntradaCorregida[]> {
    return this.http.get<EntradaCorregida[]>(`${this.base}/entradas/${idUsuario}`);
  }
}
