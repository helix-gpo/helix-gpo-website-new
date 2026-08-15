import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { Icon } from './util/icon/icon';
import { MenuModal } from './util/menu-modal/menu-modal';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Icon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  private dialog = inject(MatDialog);

  readonly environment = signal(environment.ENVIRONMENT);
  readonly isProd = computed(() => this.environment() === 'prod');
  readonly currentYear = signal(new Date().getFullYear());

  private readonly subPages = ['/impressum', '/datenschutz', '/feedback', '/project-details'];

  constructor() {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.forceScrollToTop();
    });
  }

  private forceScrollToTop() {
    if (typeof window === 'undefined') return;

    // zwei rAF-Ticks warten, bis die neue Route tatsächlich gelayoutet ist,
    // sonst greift der Sprung, während die alte (längere) Seite noch im DOM steht
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const html = document.documentElement;
        const prevBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto'; // etwaiges CSS smooth-scroll kurz aushebeln

        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        html.style.scrollBehavior = prevBehavior;
      });
    });
  }

  scrollToElementByButton(elementId: string) {
    const currentUrl = this.router.url;
    const isSubPage = this.subPages.some((page) => currentUrl.startsWith(page));

    if (isSubPage) {
      this.router.navigate(['/']);
    } else {
      this.scrollToElement(elementId);
    }
  }

  private scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  routing(url: string) {
    this.router.navigate([url]);
  }

  toToLink(url: string) {
    window.open(url, '_blank');
  }

  handleMenuButtonClick() {
    const dialogRef = this.dialog.open(MenuModal, { panelClass: 'menu-modal' });
    dialogRef.afterClosed().subscribe((element) => {
      if (element) {
        this.scrollToElementByButton(element);
      }
    });
  }
}
