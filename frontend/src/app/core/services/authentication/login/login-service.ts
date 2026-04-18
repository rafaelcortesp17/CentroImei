import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private platformId = inject(PLATFORM_ID);

  private _email = signal<string>('');  
  email = this._email.asReadonly();
  private _username = signal<string>('');
  username = this._username.asReadonly();
  private _role = signal<string>('');
  role = this._role.asReadonly();

  roleTitle = computed(() => {
      const role = this.role();
      
      if (!role) return 'USUARIO';

      const roleMap: Record<string, string> = {
        'ROLE_ADMIN': 'ADMINISTRADOR',
        'ROLE_TEACHER': 'PROFESOR',
        'ROLE_STUDENT': 'ESTUDIANTE'
      };

      return roleMap[role] || role;
    }); 

  constructor() {
    this.loadStorage();
  }

  private loadStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const roles = localStorage.getItem('userRoles');
      if (roles) {
        const roleArray = JSON.parse(roles);
        this._role.set(roleArray[0] || '');
      }
      this._email.set(localStorage.getItem('user_email') ?? '');
      this._username.set(localStorage.getItem('user_name') ?? '');
    }
  }

  setSession(email: string, username:string, roles: string[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', username);
      localStorage.setItem('userRoles', JSON.stringify(roles));
    }
    this._email.set(email);
    this._username.set(username);
    this._role.set(roles[0] || '');
  }

  clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_email');
      this._email.set('');
      localStorage.removeItem('user_name');
      this._username.set('');
      this._role.set('');
    }
  }

}
