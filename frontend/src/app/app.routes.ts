import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { AuthenticatedGuard } from './core/guards/authenticated-guard';
import { roleGuard } from './core/guards/role-guard';
import { CompleteRegistration } from './components/complete-registration/complete-registration';

export const routes: Routes = [
    {
        path: 'platform',
        loadComponent: () => import('./shared/components/layout/layout'),
        children: [
            {
                path:'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard'),
                canActivate: [AuthGuard]
            },
            {
                path:'reportes-sep',
                loadComponent: () => import('./business/administrativa/reportes-sep/reportes-sep'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_ADMIN' }
            },
            {
                path:'kardex',
                loadComponent: () => import('./business/administrativa/kardex/kardex'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_ADMIN' }
            },
            {
                path:'control-grupos',
                loadComponent: () => import('./business/administrativa/control-grupos/control-grupos'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_ADMIN' }
            },
            {
                path:'gestion-personal',
                loadComponent: () => import('./business/administrativa/gestion-personal/gestion-personal'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_ADMIN' }
            },
            {
                path:'inscripciones',
                loadComponent: () => import('./business/administrativa/inscripciones/inscripciones'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_ADMIN' }
            },
            {
                path:'planeacion-didactica',
                loadComponent: () => import('./business/docencia/planeacion-didactica/planeacion-didactica'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_TEACHER' }
            },
            {
                path:'carga-contenido',
                loadComponent: () => import('./business/docencia/carga-contenido/carga-contenido'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_TEACHER' }
            },
            {
                path:'materias',
                loadComponent: () => import('./business/estudiantil/materias/materias'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_STUDENT' }
            },
            {
                path:'contenidos',
                loadComponent: () => import('./business/estudiantil/contenidos/contenidos'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_STUDENT' }
            },
            {
                path:'actividades',
                loadComponent: () => import('./business/estudiantil/actividades/actividades'),
                canActivate: [AuthGuard, roleGuard],
                data: { expectedRole: 'ROLE_STUDENT' }
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
        path:'complete-registration',component: CompleteRegistration
    },
    {
        path: '',
        redirectTo: 'platform/dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'platform/dashboard'
    }

];
