import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Auth {


  private rolesKey = 'userRoles';
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private platformId = inject(PLATFORM_ID);

  /* private readonly BASE_URL = 'https://remove-vertex-mysql-arrangement.trycloudflare.com'; */
  private readonly BASE_URL = 'http://localhost:8080';

  private LOGIN_URL = `${this.BASE_URL}/api/v1/auth/login`;
  private REFRESH_URL = `${this.BASE_URL}/api/v1/auth/refresh`;

  // URLs para recuperación de contraseña
  private MAIL_URL = `${this.BASE_URL}/api/v1/mail/send`;
  private VERIFY_CODE_URL = `${this.BASE_URL}/api/v1/mail/verify-code`;
  private RESET_PASS_URL = `${this.BASE_URL}/api/v1/mail/reset-password`;

  //Urls para el perfil general
  private PERFIL_GENERAL_URL = `${this.BASE_URL}/api/v1/home/perfil-general`;

  //Urls para el verificacion de Token Registro usuario
  private VERIFY_TOKEN_REGISTRY_URL = `${this.BASE_URL}/api/v1/commons/verify-token`;
  private FINALIZE_REGISTRY_URL = `${this.BASE_URL}/api/v1/commons/finalize`;

  private SEND_INVITE_URL = `${this.BASE_URL}/api/v1/admin/invite`;

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

  private cloudflareHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  verifyToken(token: string): Observable<any> {
    return this.httpClient.get<any>(this.VERIFY_TOKEN_REGISTRY_URL, {params: { token: encodeURIComponent(token) },
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  }

  finalizeRegistration(registrationData: any): Observable<any> {
    const headers = this.cloudflareHeaders.set('Content-Type', 'application/json');
    console.log("Payload a enviar:", JSON.stringify(registrationData));
    return this.httpClient.post<any>(this.FINALIZE_REGISTRY_URL, registrationData,{ 
      headers: headers
    });
  }

  sendInvite(data: any): Observable<any> {
    const headers = this.cloudflareHeaders.set('Content-Type', 'application/json');
    console.log("Payload a enviar:", JSON.stringify(data));
    return this.httpClient.post<any>(this.SEND_INVITE_URL, data,{ 
      headers: headers
    });
  }

  login(email:string, password:string): Observable<any>{
    return this.httpClient.post<any>(this.LOGIN_URL,{email, password}).pipe(
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

  logout():void{
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.rolesKey);
    this.router.navigate(['/login']);
  }

  getProfileInfo(email: string): Observable<any>{
    return this.httpClient.post<any>(this.PERFIL_GENERAL_URL,{email}).pipe(
      tap(response => {
        if(response){
          console.log(response);
        }
      })
    )
  }

}
