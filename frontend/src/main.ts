import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';


bootstrapApplication(App, appConfig)
  .then(() => {
    // ✅ Esto se ejecuta DESPUÉS del bootstrap, garantizado en el browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      import('eruda').then(eruda => eruda.default.init());
    }
  })
  .catch((err) => console.error(err));
