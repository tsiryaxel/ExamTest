import { ExamsComponent } from './exams/exams.component';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './auth/auth.guard';

export const routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'exams', component: ExamsComponent, canActivate: [authGuard] }
];
