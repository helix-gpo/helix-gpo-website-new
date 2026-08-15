import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Icon } from '../../util/icon/icon';

@Component({
  selector: 'app-error',
  imports: [Icon],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class ErrorPage {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);

  constructor() {
    this.title.setTitle('Seite nicht gefunden - Helix GPO');
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

  handleBackButtonClick() {
    this.router.navigate(['/']);
  }
}
