import { Component, computed, inject, PLATFORM_ID, signal} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Auth } from '../../../core/services/auth';
import { LoginService } from '../../../core/services/authentication/login/login-service';
import { SidebarService } from '../../../core/services/sidebar/sidebar-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private platformId = inject(PLATFORM_ID);
  private loginService = inject(LoginService);

  isSidebarOpen = false;
  roleTitle = signal<string|null>(null);

  constructor(public auth: Auth, public sidebarService: SidebarService) {
    if (isPlatformBrowser(this.platformId)) {
      const role = this.loginService.roleTitle();
      if (role) {
        this.roleTitle.set(role);
      }
    }
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 1280) { // 1280px es el breakpoint 'xl' de Tailwind
      this.isSidebarOpen = false;
    }
  }
  
}
