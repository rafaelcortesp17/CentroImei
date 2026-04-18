import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResetPass } from '../reset-pass/reset-pass';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../core/services/authentication/login/login-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,MatDialogModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {

  email: string = '';
  password: string = '';
  role: string = '';

  showPassword = signal(false);

  constructor(private auth: Auth, private router:Router, 
              public dialog: MatDialog, private snackBar: MatSnackBar,
              private loginService: LoginService){}

  togglePassword() {
    // Cambia de true a false y viceversa
    this.showPassword.update(prev => !prev);
  }

  login(): void{
    // Regex: Usuario (correo valido), Password (min 8, 1 letra, 1 número)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passRegex = /^[a-zA-Z0-9@$!%*?&._-]{8,25}$/;

    if (!emailRegex.test(this.email)) {
      this.releaseStatement('El usuario debe ser un correo valido', 'error-snackbar');
      return;
    }

    if (!passRegex.test(this.password)) {
      this.releaseStatement('La contraseña requiere min. 8 caracteres, letras y números', 'error-snackbar');
      return;
    }

    this.auth.login(this.email,this.password).subscribe({
      next: (response) =>{
        const nombreUsuario = response.nombreUsuario;
        const roles: string[] = response.roles;
        const emailUser = response.email;
        this.setParamsUser(emailUser,nombreUsuario,roles);
        console.log("Roles recibidos:", roles);
        this.releaseStatement('¡Bienvenido '+ nombreUsuario +'!', 'success-snackbar');
        this.router.navigate(['/platform/dashboard']);
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
          this.email = '';
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

  setParamsUser(emailUser:string,username:string,roles:string[]){
    console.log("Email User: " + emailUser);
    console.log("User: " + emailUser);
    this.loginService.setSession(emailUser,username,roles);
  }

}
