import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si es el SERVIDOR, retornamos FALSE para que no pinte el Dashboard (adiós parpadeo)
  if (!isPlatformBrowser(platformId)) return false;

  //si es correcto el login se va al dashboard en caso en donde no hacia el login
  if(auth.isAuthenticated()){
    return true;
  }else{
    return router.parseUrl('/login');
  }
};
