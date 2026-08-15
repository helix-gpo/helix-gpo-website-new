import { Injectable, computed, inject } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Testimonial } from '../model/testimonials/testimonial';

export interface SubmitTestimonialRequest {
  token: string;
  description: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class TestimonialsService {
  private readonly http = inject(HttpClient);

  private readonly testimonialsResource = httpResource<Testimonial[]>(
    () => environment.TESTIMONIAL_SERVICE_BASE_URL,
    { defaultValue: [] },
  );

  readonly testimonials = computed(() => this.testimonialsResource.value() ?? []);
  readonly loading = computed(() => this.testimonialsResource.isLoading());

  submit(request: SubmitTestimonialRequest): Promise<Testimonial> {
    return firstValueFrom(
      this.http.post<Testimonial>(`${environment.TESTIMONIAL_SERVICE_BASE_URL}/submit`, request),
    );
  }
}
