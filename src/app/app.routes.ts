import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Impressum } from './pages/impressum/impressum';
import { Datenschutz } from './pages/datenschutz/datenschutz';
import { Feedback } from './pages/feedback/feedback';
import { ProjectDetails } from './pages/project-details/project-details';
import { ErrorPage } from './pages/error/error';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'impressum', component: Impressum },
  { path: 'datenschutz', component: Datenschutz },
  { path: 'feedback', component: Feedback },
  { path: 'project-details/:projectId', component: ProjectDetails },
  { path: 'error', component: ErrorPage },
  { path: '**', redirectTo: '/error' },
];
