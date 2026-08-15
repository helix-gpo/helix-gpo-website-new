import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly pendingTarget = signal<string | null>(null);

  setPendingTarget(elementId: string) {
    this.pendingTarget.set(elementId);
  }

  consumePendingTarget(): string | null {
    const target = this.pendingTarget();
    this.pendingTarget.set(null);
    return target;
  }
}
