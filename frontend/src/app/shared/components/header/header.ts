import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { isPlatformBrowser } from '@angular/common';
import { LoginService } from '../../../core/services/authentication/login/login-service';
import Dashboard from '../../../business/dashboard/dashboard';
import { SidebarService } from '../../../core/services/sidebar/sidebar-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private platformId = inject(PLATFORM_ID);
  private loginService = inject(LoginService);
  
  username = signal<string|null>(null);
  roleTitle = signal<string|null>(null);

  constructor(private auth: Auth, public sidebarService: SidebarService){
    if (isPlatformBrowser(this.platformId)) {
      const username = this.loginService.username();
      const roleTitle = this.loginService.roleTitle();
      if (username && roleTitle) {
        this.username.set(username);
        this.roleTitle.set(roleTitle);
      }
    }
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  logout(): void{
    this.loginService.clearSession();
    this.auth.logout();
  }
}
