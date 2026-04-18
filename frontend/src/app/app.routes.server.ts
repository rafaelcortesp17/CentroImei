import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',              // ruta raíz "/"
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'complete-registration',
    renderMode: RenderMode.Client  // Solo browser, sin SSR
  },
  {
    path: 'login',        // página pública → SSR para SEO
    renderMode: RenderMode.Server,
  },
  {
    path: 'platform/**',    // ruta protegida → CSR, el servidor entrega el shell
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
