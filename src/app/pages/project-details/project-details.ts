import { Component, computed, effect, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';
import { environment } from '../../../environments/environment';
import { Project } from '../../model/projects/project';

@Component({
  selector: 'app-project-details',
  imports: [Icon],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);

  private readonly projectId = this.route.snapshot.params['projectId'] as string;

  // single endpoint: hidden or unknown projects answer 404
  private readonly projectResource = httpResource<Project>(
    () => `${environment.PROJECT_SERVICE_BASE_URL}/${this.projectId}`,
  );

  readonly loading = computed(() => this.projectResource.isLoading());
  readonly project = computed(() =>
    this.projectResource.hasValue() ? this.projectResource.value() : undefined,
  );
  readonly primaryCategory = computed(() => this.project()?.tags[0]?.value ?? 'Projekt');

  constructor() {
    effect(() => {
      if (this.loading()) return;

      const p = this.project();
      if (p) {
        this.title.setTitle(`${p.title} - Projekte - Helix GPO`);
        this.meta.updateTag({ name: 'description', content: p.description });
        this.meta.removeTag("name='robots'");
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
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romans[index] ?? String(index + 1);
  }
}
