import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard {

  user: string = 'alumno';

  constructor(private auth: Auth){
    this.getProfileInfo();
  }

  getProfileInfo():void{
    this.auth.getProfileInfo(this.user).subscribe({
      next: (response) =>{
        console.log("La info basica de: ", response)
      }
    })
  }
}
