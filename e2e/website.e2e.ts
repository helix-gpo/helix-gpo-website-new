import { expect, test } from '@playwright/test';

test.describe('Startseite', () => {
  test('wird serverseitig mit Projekten und Referenzen ausgeliefert', async ({ page, request }) => {
    // raw html without javascript - what search engines see
    const html = await (await request.get('/')).text();
    expect(html).toContain('Bisherige Projekte');
    expect(html).toContain('Referenzen');

    await page.goto('/');
    await expect(page.getByRole('heading', { name: /DNA/ })).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#testimonials')).toBeVisible();
  });

  test('Projektkarte führt zur passenden Detailseite', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.project-card').first();
    test.skip((await card.count()) === 0, 'keine veröffentlichten Projekte im Backend');

    const title = (await card.locator('.project-title').innerText()).trim();
    await card.click();

    await expect(page).toHaveURL(/\/project-details\//);
    await expect(page.locator('.case-title')).toHaveText(title);
  });

  test('Menü öffnet sich auf dem Handy', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'nur mobil relevant');

    await page.goto('/');
    await page.getByRole('button', { name: 'Menü öffnen' }).click();

    await expect(page.getByRole('button', { name: 'Jetzt Starten' }).last()).toBeVisible();
  });
});

test.describe('Projekt-Detailseite', () => {
  test('unbekanntes Projekt zeigt Hinweis und wird nicht indexiert', async ({ page }) => {
    await page.goto('/project-details/00000000-0000-0000-0000-000000000000');

    await expect(page.getByText('Projekt nicht gefunden')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});

test.describe('Feedback', () => {
  test('ohne Token erscheint die Fehlerseite', async ({ page }) => {
    await page.goto('/feedback');

    await expect(page.getByText('Dieser Link funktioniert leider nicht')).toBeVisible();
    await expect(page.getByText(/unvollständig/)).toBeVisible();
  });

  test('mit ungültigem Token erscheint die Fehlerseite', async ({ page }) => {
    await page.goto('/feedback?token=ungueltig');

    await expect(page.getByText('Dieser Link funktioniert leider nicht')).toBeVisible();
  });
});

test.describe('Statische Seiten', () => {
  test('Impressum und Datenschutz laden', async ({ page }) => {
    await page.goto('/impressum');
    await expect(page.getByRole('heading', { name: 'Kontakt / Impressum' })).toBeVisible();

    await page.goto('/datenschutz');
    await expect(page.getByRole('heading', { name: 'Datenschutzerklärung' })).toBeVisible();
  });

  test('unbekannte Seite landet auf der 404', async ({ page }) => {
    await page.goto('/gibt-es-nicht');

    await expect(page).toHaveURL(/\/error$/);
    await expect(page.getByText(/Seite nicht gefunden/)).toBeVisible();
  });
});

test('Health-Check antwortet für den Load Balancer', async ({ request }) => {
  const response = await request.get('/healthz');

  expect(response.status()).toBe(200);
  expect(await response.text()).toBe('ok');
});
