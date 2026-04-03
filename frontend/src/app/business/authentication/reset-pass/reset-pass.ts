import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para el [(ngModel)]
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth } from '../../../core/services/auth';


@Component({
  selector: 'app-reset-pass',
  imports: [CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: './reset-pass.html',
  styleUrl: './reset-pass.scss',
})
export class ResetPass {

  step: number = 1; // 1: Email, 2: Código, 3: Nueva Contraseña
  email: string = '';
  verificationCode: string = '';

  newPassword = '';
  confirmPassword = '';
  hidePassword = true; // Controla si se ve la clave o no

  isLoading = false;

  // Inyectamos la referencia del modal para poder cerrarlo
  constructor(private auth: Auth,public dialogRef: MatDialogRef<ResetPass>,private cdr: ChangeDetectorRef) {}

  get isPasswordInvalid(): boolean {
    return this.newPassword.length < 8 || this.newPassword !== this.confirmPassword;
  }

  nextStep() {
    // Aquí llamarías a tu servicio de Spring Boot
    if (this.step === 1) {
      this.isLoading = true;
      console.log('Enviando correo a:', this.email);
      this.auth.sendRecoveryCode(this.email).subscribe({
        next: (response) => {
          console.log('Correo enviado con éxito', response);
          this.step = 2;
          this.isLoading = false;
          // FORZA LA ACTUALIZACIÓN DE LA VISTA
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error en el servicio:', err);
          // Aquí se captura el HttpStatus.CONFLICT o el 500 de Java
          alert('Error: ' + (err.error || 'No se pudo enviar el correo'));
        }
      });
    } else if (this.step === 2) {
      this.isLoading = true;
      console.log('Verificando código:', this.verificationCode);
      // Llamamos a la validación real en el Back
      this.auth.verifyCode(this.email, this.verificationCode).subscribe({
        next: (isValid) => {
          this.isLoading = false;
          if (isValid) {
            this.step = 3; // Si el código coincide, vamos a las contraseñas
          } else {
            alert('El código es incorrecto o ya expiró. Intenta de nuevo.');
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          alert('Error al validar: ' + (err.error || 'Servidor no disponible'));
        }
      });
    }else if (this.step === 3) {
      // Verificación de seguridad extra antes de disparar la petición
      if (this.isPasswordInvalid) return;

      this.isLoading = true;
      console.log('Actualizando contraseña para:', this.email);
      console.log('Cambiando contraseña a:', this.newPassword);

      this.auth.resetPassword(this.email, this.newPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Contraseña actualizada!', response);
          
          // Cerramos el modal y mandamos un mensaje de éxito
          alert('¡Tu contraseña ha sido actualizada con éxito!');
          this.dialogRef.close(true); // Retornamos true por si quieres hacer algo en el login
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Error al actualizar:', err);
          alert('Error: ' + (err.error?.message || 'No se pudo actualizar la contraseña. Intenta más tarde.'));
        }
      });
    }
  }

  closeModal() {
    // 1. Cerramos el modal físicamente
    this.dialogRef.close();

    // 2. Opcional: Reiniciamos el step por si el componente 
    // se queda en memoria o se reutiliza
    this.step = 1; 
    this.isLoading = false;
  }

}
