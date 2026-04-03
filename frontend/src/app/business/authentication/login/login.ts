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
    this.auth.login(this.user,this.password).subscribe({
      next: (response) =>{
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.role = payload.role;
        console.log("Rol: " + this.role);
        if(this.role == 'admin'){
          this.router.navigate(['/dashboard'])
        }else if(this.role == 'student'){
          this.router.navigate(['/profile'])
        }
      },
      error: (err) => console.error('Login fallo',err)
    })
  }

  openRecoveryModal() {
    const dialogRef = this.dialog.open(ResetPass, {
    width: '500px', 
    disableClose: true,
    panelClass: 'custom-modal-container'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.snackBar.open('¡Contraseña actualizada! Ya puedes iniciar sesión.', 'Entendido', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'] // Opcional: para darle color verde en CSS
      });
      
      this.user = '';
      this.password = '';
    }
  });
  }

}
