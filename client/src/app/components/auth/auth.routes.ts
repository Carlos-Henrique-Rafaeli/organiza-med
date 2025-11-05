import { Routes } from '@angular/router';
import { Registro } from './registro/registro';
import { Login } from './login/login';

export const authRoutes: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
];
