import { inject} from '@angular/core';
import { Router,CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];

  if (!authService) {
    console.error('El servicio Auth no pudo ser inyectado');
    return false;
  }

  if (authService.hasRole(expectedRole)) {
    return true;
  }

  console.warn(`Acceso denegado: Se requiere el rol ${expectedRole}`);
  router.navigate(['/platform/dashboard']); 
  return false;
};
