import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const detail = err.error?.detail;
    if (typeof detail === 'string' && detail.trim().length > 0) {
      return detail;
    }
  }
  return fallback;
}
