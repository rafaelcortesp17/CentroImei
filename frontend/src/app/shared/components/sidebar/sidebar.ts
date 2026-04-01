import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Login from '../../../business/authentication/login/login';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input()
  permission: String = '';
}
