import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';

@Component({
  selector: 'app-datenschutz',
  imports: [Icon],
  templateUrl: './datenschutz.html',
  styleUrl: './datenschutz.scss',
})
export class Datenschutz {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);

  constructor() {
    this.title.setTitle('Datenschutzerklärung - Helix GPO');
    this.meta.updateTag({
      name: 'description',
      content:
        'Datenschutzerklärung von Helix GPO gemäß DSGVO - Informationen zur Erhebung und Verarbeitung Deiner Daten.',
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

  handleBackButtonClick() {
    this.router.navigate(['/']);
  }
}
