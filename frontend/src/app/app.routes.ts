import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { AuthenticatedGuard } from './core/guards/authenticated-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout'),
        children: [
            {
                path:'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard'),
                canActivate: [AuthGuard]
            },
            {
                path:'profile',
                loadComponent: () => import('./business/profile/profile'),
                canActivate: [AuthGuard]
            },
            {
                path:'tables',
                loadComponent: () => import('./business/tables/tables'),
                canActivate: [AuthGuard]
            },
            {
                path:'',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
        ]
    },
    {
        path:'login',
        loadComponent: () => import('./business/authentication/login/login'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }

];
