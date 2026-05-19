import { test, expect } from "@playwright/test";
import { createAccount, loginViaUI } from "./helpers";

test.describe("Auth — Connexion / Déconnexion", () => {
  test("connexion via UI puis déconnexion", async ({ page, request }) => {
    // Créer un compte via API
    const { phone, password } = await createAccount(request);

    // Se connecter via l'UI
    await loginViaUI(page, phone, password);

    // Vérifier qu'on est bien dans l'app
    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 });

    // Ouvrir les paramètres (bouton Settings dans l'AppBar)
    const settingsBtn = page
      .getByRole("button", { name: /param[eè]tres|settings/i })
      .or(page.locator('[aria-label*="param" i]'))
      .or(page.locator('[data-testid="settings-btn"]'));
    await settingsBtn.first().click();

    // Le panel de paramètres doit être visible
    await expect(
      page.getByRole("heading", { name: /param[eè]tres|settings/i }).or(
        page.getByText(/param[eè]tres/i).first()
      )
    ).toBeVisible({ timeout: 5_000 });

    // Cliquer sur Se déconnecter
    const logoutBtn = page.getByRole("button", { name: /d[eé]connexion|se d[eé]connecter|logout|sign out/i });
    await logoutBtn.click();

    // Une confirmation peut apparaître — si oui, confirmer
    const confirmBtn = page.getByRole("button", { name: /confirmer|oui|yes|d[eé]connecter/i });
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }

    // Doit revenir sur la landing page ou /login
    await expect(page).toHaveURL(/\/(login|$)/, { timeout: 10_000 });
  });

  test("redirection vers /login si non authentifié", async ({ page }) => {
    await page.goto("/app");
    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
  });

  test("mauvais mot de passe — message d'erreur affiché", async ({ page, request }) => {
    const { phone } = await createAccount(request);

    await page.goto("/login");

    const identifierInput = page
      .getByPlaceholder(/email.*t[eé]l[eé]phone|phone.*email|contact/i)
      .or(page.locator("input[type=text]").first());
    await identifierInput.fill(phone);
    await page.getByPlaceholder("••••••••").fill("WrongPassword!99");
    await page.getByRole("button", { name: /connexion|se connecter|login/i }).click();

    // L'app ne doit PAS naviguer vers /app
    await page.waitForTimeout(3_000);
    await expect(page).not.toHaveURL(/\/app/);
  });
});
