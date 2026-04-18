import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { LoginService } from '../../core/services/authentication/login/login-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Notification } from '../../core/services/notification';

@Component({
  selector: 'app-dashboard',
  imports: [ MatFormFieldModule, MatInputModule, MatProgressSpinnerModule,
    MatSelectModule, MatButtonModule, MatCardModule, MatIconModule,
    MatDividerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard implements OnInit{

  private auth = inject(Auth);
  private loginService = inject(LoginService);
  private notification = inject(Notification);

  user = signal<any>(null);
  email: string = '';
  roleTitle = signal<string|null>(null);

  ngOnInit(): void {
    const savedEmail = this.loginService.email();
    if(savedEmail){
      this.getProfileInfo(savedEmail);
    }else{
      this.notification.showError("No se encontró sesión activa");
    }
  }

  getProfileInfo(email : string): void{
    this.auth.getProfileInfo(email).subscribe({
      next: (response) =>{
        console.log("La info basica de: ", response);
        this.user.set(response);
        const role = this.loginService.roleTitle();
        if(role){
          this.roleTitle.set(role);
        }
      },
      error: (err) => {
        console.error("Error al obtener perfil", err.error)
        this.notification.showError("Error al obtener perfil usuario");
      }
    })
  }
}
