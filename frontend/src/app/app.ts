import { Component, OnInit,inject,signal } from '@angular/core';
import { EscolaridadService } from './services/escolaridad.service';
import { Escolaridad } from './models/escolaridad.model';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{

  constructor(private authService: Auth){

  }

  /* private service = inject(EscolaridadService);
  public lista = signal<Escolaridad[]>([]); */

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.authService.autoRefreshToken();
    }
    /* this.service.getEscolaridades().subscribe({
      next: (data) => {
        this.lista.set(data);// Actualizamos el signal
      },
      error: (err) => console.error('Error en fetch al obtener escolaridades:', err)
    }); */
  }
}
