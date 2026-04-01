import { Component } from '@angular/core';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(private auth: Auth){

  }

  logout(): void{
    this.auth.logout();
  }
}
