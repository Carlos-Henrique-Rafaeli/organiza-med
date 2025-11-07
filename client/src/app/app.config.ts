import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { CanActivateFn, provideRouter, Router, Routes } from '@angular/router';
import { provideNotifications } from './components/shared/notificacao/notificacao.provider';
import { provideAuth } from './components/auth/auth.provider';
import { take, map } from 'rxjs';
import { AuthService } from './components/auth/auth.service';

const usuarioDesconhecidoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.accessToken$.pipe(
    take(1),
    map((token) => (!token ? true : router.createUrlTree(['/inicio']))),
  );
};

const usuarioAutenticadoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.accessToken$.pipe(
    take(1),
    map((token) => (token ? true : router.createUrlTree(['/auth/login']))),
  );
};

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes').then((r) => r.authRoutes),
    canActivate: [usuarioDesconhecidoGuard],
  },

  {
    path: 'inicio',
    loadComponent: () => import('./components/inicio/inicio').then((c) => c.Inicio),
    canActivate: [usuarioAutenticadoGuard],
  },

  {
    path: 'pacientes',
    loadChildren: () =>
      import('./components/pacientes/paciente.routes').then((r) => r.pacienteRoutes),
    canActivate: [usuarioAutenticadoGuard],
  },

  {
    path: 'medicos',
    loadChildren: () => import('./components/medicos/medico.routes').then((r) => r.medicoRoutes),
    canActivate: [usuarioAutenticadoGuard],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    provideNotifications(),
    provideAuth(),
  ],
};
