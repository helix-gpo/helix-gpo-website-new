import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';
import { Hint } from '../../util/hint/hint';
import { TestimonialsService } from '../../services/testimonials.service';
import { extractErrorMessage } from '../../util/error-message';
import { environment } from '../../../environments/environment';
import { PublicInvitation } from '../../model/testimonials/public-invitation';

@Component({
  selector: 'app-feedback',
  imports: [Icon, Hint],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly testimonialsService = inject(TestimonialsService);

  readonly ratingArray = [1, 2, 3, 4, 5];
  readonly maxDescriptionLength = 1000;

  // the token only ever comes from the invitation link
  private readonly token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';

  // checked on page load, so an expired link is reported before anyone writes their text
  private readonly invitationResource = httpResource<PublicInvitation>(() =>
    this.token
      ? `${environment.TESTIMONIAL_SERVICE_BASE_URL}/invitation?token=${encodeURIComponent(this.token)}`
      : undefined,
  );

  readonly invitation = computed(() =>
    this.invitationResource.hasValue() ? this.invitationResource.value() : undefined,
  );
  readonly loadingInvitation = computed(() => this.invitationResource.isLoading());

  readonly invitationError = computed(() => {
    if (!this.token) {
      return 'Dieser Link ist unvollständig. Bitte öffne ihn direkt aus Deiner Einladungs-E-Mail.';
    }
    const err = this.invitationResource.error();
    return err
      ? extractErrorMessage(
          err,
          'Dein Link konnte gerade nicht geprüft werden. Bitte versuch es später erneut.',
        )
      : null;
  });

  // name, role and company are taken from the crm - the preview shows exactly what gets published
  readonly previewName = computed(() => {
    const i = this.invitation();
    return i ? `${i.firstName} ${i.lastName}` : '';
  });
  readonly previewRole = computed(() => {
    const i = this.invitation();
    return [i?.role, i?.companyName].filter(Boolean).join(' · ');
  });
  readonly previewInitials = computed(() => {
    const i = this.invitation();
    return i ? `${i.firstName.charAt(0)}${i.lastName.charAt(0)}`.toUpperCase() : '?';
  });
  readonly previewToday = new Date().toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  });

  readonly description = signal('');
  readonly rating = signal(0);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly submitError = signal('');

  readonly showDescriptionWarning = signal(false);
  readonly showRatingWarning = signal(false);

  constructor() {
    this.title.setTitle('Feedback geben - Helix GPO');
    this.meta.updateTag({
      name: 'description',
      content:
        'Teile Deine Erfahrung mit Helix GPO und hilf anderen Unternehmen bei ihrer Entscheidung.',
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

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

    this.showDescriptionWarning.set(!descriptionValid);
    this.showRatingWarning.set(!ratingValid);
    if (!descriptionValid || !ratingValid) {
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');

    try {
      await this.testimonialsService.submit({
        token: this.token,
        description: this.description().trim(),
        rating: this.rating(),
      });
      this.submitted.set(true);
    } catch (err) {
      this.submitError.set(
        extractErrorMessage(err, 'Absenden fehlgeschlagen - bitte versuch es gleich noch einmal.'),
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
