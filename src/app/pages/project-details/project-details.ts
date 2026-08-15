import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';
import { ScrollService } from '../../util/scroll/scroll';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-project-details',
  imports: [Icon],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scrollService = inject(ScrollService);
  private title = inject(Title);
  private meta = inject(Meta);
  private readonly projectsService = inject(ProjectsService);

  // String-ID (UUID) statt Number() - kein Einzel-Endpoint im Backend,
  // daher Lookup aus der bereits geladenen 6er-Liste statt Einzelabruf
  private readonly projectId = this.route.snapshot.params['projectId'] as string;

  readonly project = computed(() => this.projectsService.findById(this.projectId));
  readonly primaryCategory = computed(() => this.project()?.tags[0]?.value ?? 'Projekt');

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.title.setTitle(`${p.title} - Projekte - Helix GPO`);
        this.meta.updateTag({ name: 'description', content: p.description });
      } else {
        this.title.setTitle('Projekt nicht gefunden - Helix GPO');
        this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
      }
    });
  }

  handleBackButtonClick() {
    this.router.navigate(['/']);
  }

  formatMonthYear(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  }

  toRomanStep(index: number): string {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    return romans[index] ?? String(index + 1);
  }
}
