import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';

@Component({
  selector: 'app-impressum',
  imports: [Icon],
  templateUrl: './impressum.html',
  styleUrl: './impressum.scss',
})
export class Impressum {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);

  constructor() {
    this.title.setTitle('Impressum - Helix GPO');
    this.meta.updateTag({
      name: 'description',
      content:
        'Impressum und Kontaktangaben der Helix GPO UG (haftungsbeschränkt) & Co. KG aus Neuss.',
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

  handleBackButtonClick() {
    this.router.navigate(['/']);
  }
}
