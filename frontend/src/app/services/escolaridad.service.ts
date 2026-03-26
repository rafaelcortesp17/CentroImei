import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Escolaridad } from '../models/escolaridad.model';

@Injectable({
  providedIn: 'root',
})
export class EscolaridadService {
   private http = inject(HttpClient); // Nueva forma de inyectar en Angular 21
  private apiUrl = 'http://localhost:8080/api/escolaridad';

  getEscolaridades(): Observable<Escolaridad[]> {
    return this.http.get<Escolaridad[]>(this.apiUrl);
  }
}
