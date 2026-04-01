import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {

  user: string = '';
  password: string = '';
  role: string = '';

  constructor(private auth: Auth, private router:Router){
  }

  login(): void{
    this.auth.login(this.user,this.password).subscribe({
      next: (response) =>{
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.role = payload.role;
        if(this.role == 'admin'){
          this.router.navigate(['/dashboard'])
        }else if(this.role == 'student'){
          this.router.navigate(['/profile'])
        }
      },
      error: (err) => console.error('Login fallo',err)
    })
  }

}
