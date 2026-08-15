import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';
import { ProjectsService } from '../../services/projects.service';
import { TestimonialsService } from '../../services/testimonials.service';

@Component({
  selector: 'app-main',
  imports: [Icon],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  private title = inject(Title);
  private meta = inject(Meta);
  private readonly projectsService = inject(ProjectsService);
  private readonly testimonialsService = inject(TestimonialsService);

  constructor(private router: Router) {
    this.title.setTitle('Helix GPO - Digitalisierung & Geschäftsprozessoptimierung aus Neuss');
    this.meta.updateTag({
      name: 'description',
      content:
        'Helix GPO gestaltet die Prozesse Deines Unternehmens effizient, effektiv und digital - durch moderne Geschäftsprozessoptimierung, Automatisierung und KI-Integration in Neuss.',
    });
  }

  // =====================
  // PROJEKTE
  // =====================

  readonly projects = this.projectsService.projects;
  readonly showAllProjects = signal(false);

  readonly shownProjects = computed(() =>
    this.showAllProjects() ? this.projects() : this.projects().slice(0, 3),
  );

  readonly showAllProjectsText = computed(() =>
    this.showAllProjects() ? 'Weniger Anzeigen' : 'Mehr Anzeigen',
  );

  handleToggleShowAllProjectsButton() {
    this.showAllProjects.update((current) => !current);
    if (!this.showAllProjects()) {
      this.scrollToElementByButton('projects');
    }
  }

  handleProjectDetailsButtonClick(projectId: string) {
    this.router.navigate(['project-details', projectId]).then(() => {
      this.scrollToElementByButton('header');
    });
  }

  // =====================
  // REFERENZEN
  // =====================

  readonly testimonials = this.testimonialsService.testimonials;
  readonly ratingArray = [1, 2, 3, 4, 5];
  readonly showLeftTestimonials = signal(true);

  readonly averageRating = computed(() => {
    const all = this.testimonials();
    if (all.length === 0) return 0;
    const sum = all.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / all.length) * 10) / 10;
  });

  readonly shownTestimonials = computed(() => {
    const all = this.testimonials();
    return this.showLeftTestimonials() ? all.slice(0, 3) : all.slice(3, 6);
  });

  handleShowLeftPage() {
    this.showLeftTestimonials.set(true);
    this.scrollToElementByButton('testimonials');
  }

  handleShowRightPage() {
    this.showLeftTestimonials.set(false);
    this.scrollToElementByButton('testimonials');
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  // =====================
  // ALLGEMEIN
  // =====================

  formatMonthYear(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  }

  scrollToElementByButton(elementId: string) {
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
