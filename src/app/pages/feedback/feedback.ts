import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';
import { TestimonialsService } from '../../services/testimonials.service';
import { extractErrorMessage } from '../../util/error-message';
import { Hint } from '../../util/hint/hint';

@Component({
  selector: 'app-feedback',
  imports: [Icon, Hint],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private readonly testimonialsService = inject(TestimonialsService);

  constructor() {
    this.title.setTitle('Feedback geben - Helix GPO');
    this.meta.updateTag({
      name: 'description',
      content:
        'Teile Deine Erfahrung mit Helix GPO und hilf anderen Unternehmen bei ihrer Entscheidung.',
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });

    // Token per Link aus der Einladungsmail vorbefüllen (?token=...) -
    // manuelles Eintippen bleibt als Fallback möglich
    const tokenFromUrl = this.route.snapshot.queryParamMap.get('token');
    if (tokenFromUrl) {
      this.authToken.set(tokenFromUrl);
    }
  }

  readonly ratingArray = [1, 2, 3, 4, 5];

  // Name/Rolle sind NUR für die Live-Vorschau - das Backend nimmt den
  // tatsächlich veröffentlichten Namen/Rolle/Firma aus dem
  // Einladungs-Partner-Snapshot, nicht aus diesen Feldern
  readonly name = signal('');
  readonly roleCompany = signal('');
  readonly description = signal('');
  readonly rating = signal(0);
  readonly authToken = signal('');

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly submitError = signal('');

  readonly showDescriptionWarning = signal(false);
  readonly showRatingWarning = signal(false);
  readonly showAuthTokenWarning = signal(false);

  readonly previewInitials = computed(() => {
    const value = this.name().trim();
    if (!value) return '?';
    return value
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  readonly previewToday = computed(() =>
    new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
  );

  handleBackButtonClick() {
    this.router.navigate(['/']);
  }

  handleRatingClick(value: number) {
    this.rating.set(value);
    this.showRatingWarning.set(false);
  }

  async handleSendButtonClick() {
    const descriptionValid = this.description().trim().length > 0;
    const ratingValid = this.rating() > 0;
    const tokenValid = this.authToken().trim().length > 0;

    this.showDescriptionWarning.set(!descriptionValid);
    this.showRatingWarning.set(!ratingValid);
    this.showAuthTokenWarning.set(!tokenValid);

    if (!descriptionValid || !ratingValid || !tokenValid) {
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');

    try {
      await this.testimonialsService.submit({
        token: this.authToken().trim(),
        description: this.description().trim(),
        rating: this.rating(),
      });
      this.submitted.set(true);
    } catch (err) {
      this.submitError.set(
        extractErrorMessage(
          err,
          'Absenden fehlgeschlagen - bitte prüfe deinen Code und versuch es erneut.',
        ),
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
