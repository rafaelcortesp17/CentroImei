import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Notification } from '../../core/services/notification';

@Component({
  selector: 'app-complete-registration',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    MatStepperModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './complete-registration.html',
  styleUrl: './complete-registration.scss'
})
export class CompleteRegistration {

  private route = inject(ActivatedRoute);
  private authService = inject(Auth);
  private router = inject(Router);
  private notification = inject(Notification);

  token = signal<string | null>(null);
  isValidToken = signal(false);
  loading = signal(true);
  
  nombre = signal('');
  apellidoPaterno = signal('');
  apellidoMaterno = signal(''); // Opcional
  direccion = signal('');
  telefono = signal('');
  
  password = signal('');
  confirmPassword = signal('');
  hidePassword = signal(true);

  profileForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/)
    ]),
    apellidoPaterno: new FormControl('', [
      Validators.required, 
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/)
    ]),
    apellidoMaterno: new FormControl('', [
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/)
    ]),
    direccion: new FormControl('', [
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s.,#-]+$/)
    ]),
    telefono: new FormControl('', [
      Validators.required, 
      Validators.pattern(/^[0-9]{10}$/)
    ])
  });

  passwordRequirements = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  checkPassword() {
    const p = this.password() || '';
    this.passwordRequirements = {
      length: p.length >= 8 && p.length <= 64,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      special: /[@$!%*?&._-]/.test(p)
    };
  }

  constructor(){
    afterNextRender(() => {
      this.token.set(this.route.snapshot.queryParamMap.get('token'));
      console.log('Token obtenido:', this.token);

      if (this.token) {
        this.authService.verifyToken(this.token()!).subscribe({
          next: (res) => {
            this.isValidToken.set(true);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Status:', err.status);
            console.error('Error:', err);
            this.isValidToken.set(false);
            this.loading.set(false);
          }
        });
      } else {
        console.warn('No hay token en la URL');
        this.notification.showError('No hay token en la URL');
        this.loading.set(false);
      }
    });
  }
  
  isStep1Valid(): boolean {
    return this.profileForm.valid;
  }

  onFinalRegister(): void {
    const formValues = this.profileForm.value;

    this.nombre.set(formValues.nombre || '');
    this.apellidoPaterno.set(formValues.apellidoPaterno || '');
    this.apellidoMaterno.set(formValues.apellidoMaterno || '');
    this.direccion.set(formValues.direccion || '');
    this.telefono.set(formValues.telefono || '');

    if (this.password() !== this.confirmPassword()) {
      this.notification.showError('Las contraseñas no coinciden');
      return;
    }
    if (this.password().length < 8) {
      this.notification.showError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const payload = {
      token: this.token(),
      password: this.password(),
      personalData: this.profileForm.value
    };

    this.authService.finalizeRegistration(payload).subscribe({
      next: () => {
        this.notification.showSuccess('¡Registro completado! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("error registracion: "+ err.error.message);
        this.notification.showError(err.error.message);
      }
    });
  }
}
