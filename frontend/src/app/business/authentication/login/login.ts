import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResetPass } from '../reset-pass/reset-pass';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,MatDialogModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {

  user: string = '';
  password: string = '';
  role: string = '';

  constructor(private auth: Auth, private router:Router, public dialog: MatDialog, private snackBar: MatSnackBar){
  }

  login(): void{
    // Regex: Usuario (letras/números 4-12), Password (min 8, 1 letra, 1 número)
    const userRegex = /^[a-zA-Z0-9]{4,16}$/;
    const passRegex = /^[a-zA-Z0-9@$!%*?&._-]{8,25}$/;

    if (!userRegex.test(this.user)) {
      this.releaseStatement('El usuario debe ser alfanumérico (4-12 caracteres)', 'error-snackbar');
      return;
    }

    if (!passRegex.test(this.password)) {
      this.releaseStatement('La contraseña requiere min. 8 caracteres, letras y números', 'error-snackbar');
      return;
    }

    this.auth.login(this.user,this.password).subscribe({
      next: (response) =>{
        const roles: string[] = response.roles;
        console.log("Roles recibidos:", roles);
        this.releaseStatement('¡Bienvenido '+ this.user +'!', 'success-snackbar');
        this.router.navigate(['/dashboard']);
      },
        error: (err) => {
        console.error('Login falló', err);

        // Si el back mandó .body("Error Authetication:::..."), viene en err.error
        let mensajeError = 'Ocurrió un error inesperado';

        console.error('Estatus error', err.status);
        if (err.status === 401) {
          mensajeError = 'Usuario o contraseña incorrectos';
        } else if (err.status === 403) {
          mensajeError = 'No tienes permiso para acceder';
        } else if (err.status === 0) {
          mensajeError = 'No hay conexión con el servidor';
        } else if (typeof err.error === 'string') {
          mensajeError = err.error;
        }
        console.error(mensajeError);
        this.releaseStatement(mensajeError,'error-snackbar');
      }
    });
  }

  openRecoveryModal() {
    const dialogRef = this.dialog.open(ResetPass, {
    width: '500px', 
    disableClose: true,
    panelClass: 'custom-modal-container'
  });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.releaseStatement(result.message,'success-snackbar');
        
        setTimeout(() => {
          this.user = '';
          this.password = '';
        });
      }else if(result.success === false){
        this.releaseStatement(result.message,'error-snackbar');
      }
    });
  }

  releaseStatement(mensaje: string, clase: string) {
    this.snackBar.open(mensaje, 'Entendido', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: [clase]
    });
  }

}
