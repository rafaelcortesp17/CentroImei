import { Component, OnInit,inject,signal } from '@angular/core';
import { EscolaridadService } from './services/escolaridad.service';
import { Escolaridad } from './models/escolaridad.model';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{

  private service = inject(EscolaridadService);
  public lista = signal<Escolaridad[]>([]);

  ngOnInit(): void {
    this.service.getEscolaridades().subscribe({
      next: (data) => {
        this.lista.set(data);// Actualizamos el signal
      },
      error: (err) => console.error('Error en fetch al obtener escolaridades:', err)
    });
  }
}
