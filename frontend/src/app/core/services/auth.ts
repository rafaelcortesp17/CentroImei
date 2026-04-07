import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private rolesKey = 'userRoles';

  private LOGIN_URL = 'http://localhost:8080/api/v1/auth/login';
  private tokenKey = 'authToken';
  private REFRESH_URL = 'http://localhost:8080/api/v1/auth/refresh';
  private refreshTokenKey = 'refreshToken';
  private platformId = inject(PLATFORM_ID);

  // URLs para recuperación de contraseña
  private MAIL_URL = 'http://localhost:8080/api/v1/mail/send';
  private VERIFY_CODE_URL = 'http://localhost:8080/api/v1/mail/verify-code';
  private RESET_PASS_URL = 'http://localhost:8080/api/v1/mail/reset-password';

  //Urls para el perfil general
  private PERFIL_GENERAL_URL = 'http://localhost:8080/api/v1/home/perfil-general';

  constructor(private httpClient: HttpClient, private router: Router){}

  sendRecoveryCode(correo: string): Observable<any> {
    return this.httpClient.post<any>(this.MAIL_URL, { correo });
  }

  verifyCode(correo: string, code: string): Observable<any> {
    return this.httpClient.post<any>(this.VERIFY_CODE_URL, { correo, code });
  }

  resetPassword(correo: string, password: string): Observable<any> {
    return this.httpClient.put<any>(this.RESET_PASS_URL, { correo, password });
  }

  login(user:string, password:string): Observable<any>{
    return this.httpClient.post<any>(this.LOGIN_URL,{user, password}).pipe(
      tap(response => {
        if(response.token){
          console.log(response.token);
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);

          if(response.roles){
            this.setRoles(response.roles);
          }

          this.autoRefreshToken();
        }
      }),
      catchError(error => {
        // Aquí puedes loguear el error o transformarlo
        console.error("Error capturado en el servicio:", error);
        return throwError(() => error); 
      })
    )
  }

  private setRoles(roles: string[]): void {
    localStorage.setItem(this.rolesKey, JSON.stringify(roles));
  }

  public getRoles(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const roles = localStorage.getItem(this.rolesKey);
    return roles ? JSON.parse(roles) : [];
  }

  public hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  private setToken(token: string): void{
    localStorage.setItem(this.tokenKey,token)
  }

  private getToken(): string | null{
    return localStorage.getItem(this.tokenKey)
  }
  
  private setRefreshToken(token: string): void{
    localStorage.setItem(this.refreshTokenKey,token)
  }

  private getResfreshToken(): string | null{
    return localStorage.getItem(this.refreshTokenKey)
  }

  refreshToken(): Observable<any>{
    const refreshToken = this.getResfreshToken();
    return this.httpClient.post<any>(this.REFRESH_URL,{refreshToken}).pipe(
      tap(response => {
        if(response.token){
          console.log(response.token);
          this.setToken(response.token); 
          this.setRefreshToken(response.refreshToken);
          this.autoRefreshToken();
        }
      })
    )
  }

  autoRefreshToken(): void{
    // 1. Si NO es el navegador, no podemos saber si está logueado (retornamos false)
    if (!isPlatformBrowser(this.platformId)) {
      return; 
    }
    // 2. Lógica real (Solo se ejecuta en el navegador)
    const token = this.getToken();// Aquí ya no necesitamos el if(isPlatformBrowser) interno
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      
      const timeout = exp - Date.now() - (60 * 1000);

      setTimeout(() => {
        this.refreshToken().subscribe()
      },timeout);

    } catch (e) {
      return; // Token mal formado
    }
  }

  isAuthenticated(): boolean {
    // 1. Si NO es el navegador, no podemos saber si está logueado (retornamos false)
    if (!isPlatformBrowser(this.platformId)) {
      return false; 
    }
    // 2. Lógica real (Solo se ejecuta en el navegador)
    const token = this.getToken();// Aquí ya no necesitamos el if(isPlatformBrowser) interno
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false; // Token mal formado
    }
  }

  getProfileInfo(username: string): Observable<any>{
    return this.httpClient.post<any>(this.PERFIL_GENERAL_URL,{username}).pipe(
      tap(response => {
        if(response){
          console.log(response);
        }
      })
    )
  }

  logout():void{
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.rolesKey);
    this.router.navigate(['/login']);
  }

}
