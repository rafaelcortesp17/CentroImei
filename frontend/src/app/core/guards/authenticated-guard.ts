import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true;

  // Si ya está logueado, lo regresamos al dashboard
  if(auth.isAuthenticated()){
    return router.parseUrl('/platform/dashboard');
  }else{
    return true;
  }
};
