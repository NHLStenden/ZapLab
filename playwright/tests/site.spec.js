const { test, expect } = require('@playwright/test');

test.describe('OWASP ZAP PHP-oefenwebsite', () => {
  test('startpagina toont navigatie naar alle vier pagina’s', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welkom in het oefenlab' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Zoeken' })).toHaveAttribute('href', '/search.php');
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact.php');
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Inloggen' })).toHaveAttribute('href', '/login.php');
  });

  test('zoekpagina bevat uitleg en verwerkt een normale zoekterm', async ({ page }) => {
    await page.goto('/search.php');
    await expect(page.getByRole('heading', { name: 'Zelf kwetsbaarheden uitproberen' })).toBeVisible();
    await expect(page.getByText('2. HTML-injectie', { exact: true })).toBeVisible();
    await page.getByLabel('Zoekterm').fill('Playwright test');
    await page.getByRole('button', { name: 'Zoeken' }).click();
    await expect(page.getByText('Je zocht naar:')).toBeVisible();
    await expect(page.locator('strong').filter({ hasText: 'Playwright test' })).toBeVisible();
  });

  test('zoekpagina demonstreert reflected XSS in de lokale labomgeving', async ({ page }) => {
    const dialogs = [];
    page.on('dialog', async dialog => {
      dialogs.push(dialog.message());
      await dialog.accept();
    });
    await page.goto('/search.php');
    await page.getByLabel('Zoekterm').fill("<script>alert('pw-search-xss')</script>");
    await page.getByRole('button', { name: 'Zoeken' }).click();
    await expect.poll(() => dialogs).toContain('pw-search-xss');
  });

  test('contactformulier wijst lege invoer af', async ({ page }) => {
    await page.goto('/contact.php');
    await page.getByRole('button', { name: 'Versturen' }).click();
    await expect(page.getByText('Vul beide velden in.')).toBeVisible();
  });

  test('contactpagina bewaart bericht in sessie en demonstreert stored XSS', async ({ page }) => {
    const dialogs = [];
    page.on('dialog', async dialog => {
      dialogs.push(dialog.message());
      await dialog.accept();
    });
    await page.goto('/contact.php');
    await page.getByLabel('Naam').fill('Playwright gebruiker');
    await page.getByLabel('Bericht').fill("<script>alert('pw-contact-xss')</script>");
    await page.getByRole('button', { name: 'Versturen' }).click();
    await expect(page.getByText('Bericht opgeslagen.')).toBeVisible();
    await expect.poll(() => dialogs).toContain('pw-contact-xss');
    await expect(page.locator('article')).toContainText('Playwright gebruiker');
  });

  test('login accepteert het geldige demo-account', async ({ page }) => {
    await page.goto('/login.php');
    await page.getByLabel('Gebruikersnaam').fill('admin');
    await page.getByLabel('Wachtwoord').fill('zapdemo');
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page.getByText('Ingelogd als admin')).toBeVisible();
  });

  test('login weigert onjuiste normale inloggegevens', async ({ page }) => {
    await page.goto('/login.php');
    await page.getByLabel('Gebruikersnaam').fill('geen-gebruiker');
    await page.getByLabel('Wachtwoord').fill('onjuist');
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page.getByText('Ongeldige inloggegevens.')).toBeVisible();
  });

  test('login demonstreert SQL-injection bypass in de lokale labomgeving', async ({ page }) => {
    await page.goto('/login.php');
    await page.getByLabel('Gebruikersnaam').fill("' OR '1'='1' -- ");
    await page.getByLabel('Wachtwoord').fill('willekeurig');
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page.getByText('Ingelogd als admin')).toBeVisible();
  });
});
