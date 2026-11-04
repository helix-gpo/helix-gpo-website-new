import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // live crm data (projects, testimonials) - rendered per request, never frozen at build time
  { path: '', renderMode: RenderMode.Server },
  { path: 'project-details/:projectId', renderMode: RenderMode.Server },
  // token comes from the invitation link and the page is noindex - browser only
  { path: 'feedback', renderMode: RenderMode.Client },
  // static pages without api data
  { path: '**', renderMode: RenderMode.Prerender },
];
