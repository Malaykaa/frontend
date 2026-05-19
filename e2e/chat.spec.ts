import { test, expect } from "@playwright/test";
import { createAccount, loginViaUI, createThread } from "./helpers";

test.describe("Chat — Envoi de message → réponse streamée", () => {
  test("envoyer un message et recevoir une réponse de l'IA", async ({ page, request }) => {
    // Créer un compte et un thread via API
    const { phone, password, token } = await createAccount(request);
    const threadId = await createThread(request, token, "Stage en Marketing Digital");

    // Se connecter via l'UI
    await loginViaUI(page, phone, password);

    // Naviguer directement vers le thread
    await page.goto(`/app/chat/${threadId}`);
    await expect(page).toHaveURL(`/app/chat/${threadId}`, { timeout: 10_000 });

    // Vérifier que le header du chat est visible
    await expect(
      page.getByText(/stage en marketing digital/i).or(page.locator("header")).first()
    ).toBeVisible({ timeout: 8_000 });

    // Trouver la zone de saisie du message
    const messageInput = page
      .getByPlaceholder(/message|saisir|[eé]crire|type/i)
      .or(page.locator("textarea").first())
      .or(page.locator("input[type=text]:visible").last());

    await messageInput.first().fill(
      "Quelles compétences dois-je développer pour un stage en marketing digital ?"
    );

    // Envoyer le message (bouton ou Entrée)
    const sendBtn = page
      .getByRole("button", { name: /envoyer|send/i })
      .or(page.locator('[type="submit"]').last());

    if (await sendBtn.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await sendBtn.click();
    } else {
      await messageInput.first().press("Enter");
    }

    // Le message utilisateur doit apparaître dans le fil
    await expect(
      page.getByText(/comp[eé]tences.*marketing|marketing.*comp[eé]tences/i)
    ).toBeVisible({ timeout: 5_000 });

    // Attendre qu'une réponse de l'IA apparaisse (streaming peut prendre du temps)
    // On attend soit un indicateur de chargement, soit du texte de réponse
    const loadingIndicator = page.locator(
      '[data-testid="streaming"], .animate-pulse, [aria-label*="chargement" i]'
    );
    const aiResponse = page.locator('[data-testid="ai-message"], .prose, [role="article"]').last();

    // Attendre que le streaming démarre (indicateur visible)
    await expect(loadingIndicator.or(aiResponse)).toBeVisible({ timeout: 15_000 });

    // Attendre que la réponse soit complète (indicateur disparaît ou texte substantiel)
    await expect(aiResponse).toBeVisible({ timeout: 45_000 });
    const responseText = await aiResponse.textContent();
    expect(responseText?.length).toBeGreaterThan(20);
  });

  test("le bouton d'envoi est désactivé quand le champ est vide", async ({ page, request }) => {
    const { phone, password, token } = await createAccount(request);
    const threadId = await createThread(request, token, "Test bouton vide");

    await loginViaUI(page, phone, password);
    await page.goto(`/app/chat/${threadId}`);

    const sendBtn = page
      .getByRole("button", { name: /envoyer|send/i })
      .or(page.locator('[type="submit"]').last());

    // Le bouton doit être désactivé ou absent quand le champ est vide
    const isDisabled = await sendBtn.isDisabled().catch(() => true);
    expect(isDisabled).toBeTruthy();
  });

  test("navigation retour depuis le chat vers l'app", async ({ page, request }) => {
    const { phone, password, token } = await createAccount(request);
    const threadId = await createThread(request, token, "Thread navigation test");

    await loginViaUI(page, phone, password);
    await page.goto(`/app/chat/${threadId}`);
    await expect(page).toHaveURL(`/app/chat/${threadId}`, { timeout: 10_000 });

    // Bouton retour
    const backBtn = page
      .getByRole("button", { name: /retour|back|←/i })
      .or(page.locator('[aria-label*="retour" i]'))
      .or(page.locator('[data-testid="back-btn"]'));

    await backBtn.first().click();
    await expect(page).toHaveURL(/\/app(?!\/chat)/, { timeout: 8_000 });
  });
});
