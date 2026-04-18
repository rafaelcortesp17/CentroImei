import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-gestion-personal',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, 
    MatSelectModule, MatButtonModule, MatCardModule, MatIconModule
  ],
  templateUrl: './gestion-personal.html',
  styleUrl: './gestion-personal.scss',
})
export default class GestionPersonal {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private notification = inject(Notification);
  

  inviteForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]]
  });

  onSendInvitation() {
    if (this.inviteForm.valid) {
      const payload = this.inviteForm.value;
      console.log('Enviando al back:', payload);
      this.authService.sendInvite(payload).subscribe({
      next: () => {
        this.notification.showSuccess('Se envio la invitación de Registro con éxito.');
        this.resetForm();
      },
      error: (err) => {
        console.error("error registracion: "+ err.error.message);
        this.notification.showError(err.error.message);
      }
    });
    }
  }

  private resetForm() {
    this.inviteForm.reset();
    
    // para que no aparezcan errores en rojo
    Object.keys(this.inviteForm.controls).forEach(key => {
      const control = this.inviteForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

}
