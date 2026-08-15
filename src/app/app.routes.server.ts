import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamische Projekt-Detailseiten kommen aus der API -> nicht statisch vorrenderbar
  {
    path: 'project-details/:projectId',
    renderMode: RenderMode.Server,
  },
  // Alle statischen Seiten (Home, Impressum, Datenschutz, ...) vorrendern -> maximale SEO-Performance
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
