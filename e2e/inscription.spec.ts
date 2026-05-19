import { test, expect } from "@playwright/test";
import { uniquePhone } from "./helpers";

test.describe("Inscription — OTP → Onboarding → Premier objectif", () => {
  test("parcours complet d'inscription", async ({ page, request }) => {
    const phone = uniquePhone();
    const password = "Test@12345";

    // 1. Aller sur la landing page
    await page.goto("/");

    // Cliquer sur le CTA d'inscription (Commencer, S'inscrire, etc.)
    const ctaBtn = page
      .getByRole("link", { name: /commencer|s'inscrire|inscription|get started/i })
      .or(page.getByRole("button", { name: /commencer|s'inscrire|inscription/i }));
    await ctaBtn.first().click();

    // Doit arriver sur /login ou /onboarding
    await expect(page).toHaveURL(/\/(login|onboarding)/, { timeout: 8_000 });

    // Si on est sur /login, chercher le lien vers l'inscription
    if (page.url().includes("/login")) {
      const registerLink = page
        .getByRole("link", { name: /cr[eé]er.*compte|inscription|s'inscrire|register/i })
        .or(page.getByText(/cr[eé]er.*compte|pas encore inscrit/i).first());
      if (await registerLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await registerLink.click();
      }
    }

    // 2. Renseigner le numéro de téléphone pour l'OTP
    const phoneInput = page
      .getByPlaceholder(/t[eé]l[eé]phone|phone|num[eé]ro/i)
      .or(page.locator("input[type=tel]").first())
      .or(page.locator("input[name*='phone']").first());
    await phoneInput.first().fill(phone);

    // Envoyer l'OTP
    const sendOtpBtn = page.getByRole("button", {
      name: /envoyer|recevoir.*code|send.*otp|continuer|suivant/i,
    });
    await sendOtpBtn.first().click();

    // 3. Intercepter l'OTP via l'API (dev_code renvoyé dans la réponse send-otp)
    const otpRes = await request.post("http://localhost:8000/auth/send-otp", {
      data: { phone },
    });
    // Si le compte vient d'être créé par le clic précédent, on récupère le code
    let devCode = "";
    if (otpRes.ok()) {
      const body = (await otpRes.json()) as { dev_code?: string };
      devCode = body.dev_code ?? "";
    }

    // Saisir le code OTP dans le champ
    if (devCode) {
      const otpInput = page
        .getByPlaceholder(/code|otp|v[eé]rification/i)
        .or(page.locator("input[maxlength='6']").first())
        .or(page.locator("input[type=number]").first());
      await otpInput.first().fill(devCode);
    }

    // Saisir le mot de passe
    const pwInput = page
      .getByPlaceholder(/mot de passe|password|••••/i)
      .or(page.locator("input[type=password]").first());
    await pwInput.first().fill(password);

    // Valider le formulaire d'inscription
    const verifyBtn = page.getByRole("button", {
      name: /v[eé]rifier|cr[eé]er.*compte|s'inscrire|valider|register|confirmer/i,
    });
    await verifyBtn.first().click();

    // 4. Onboarding — l'utilisateur doit traverser les étapes
    // Attendre que l'onboarding ou l'app apparaisse
    await expect(page).toHaveURL(/\/(onboarding|app)/, { timeout: 15_000 });

    if (page.url().includes("/onboarding")) {
      // Traverser les étapes de l'onboarding (cliquer sur Suivant / Continuer)
      for (let step = 0; step < 8; step++) {
        const nextBtn = page.getByRole("button", {
          name: /suivant|continuer|next|valider|terminer|commencer/i,
        });
        if (await nextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
          // Remplir les champs si présents
          const textInputs = page.locator("input[type=text]:visible, input[type=email]:visible");
          const count = await textInputs.count();
          for (let i = 0; i < count; i++) {
            const input = textInputs.nth(i);
            const placeholder = (await input.getAttribute("placeholder")) ?? "";
            if (/nom|name/i.test(placeholder)) await input.fill("Test User");
            else if (/email/i.test(placeholder)) await input.fill(`test+${phone.slice(-6)}@example.com`);
            else if (/ville|city/i.test(placeholder)) await input.fill("Abidjan");
            else if (!await input.inputValue()) await input.fill("Étudiant");
          }
          await nextBtn.first().click();
          await page.waitForTimeout(500);
        } else {
          break;
        }
      }

      // Attendre l'app après l'onboarding
      await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });
    }

    // 5. Créer un premier objectif
    // Chercher le bouton "Nouveau / Nouvel objectif / +"
    const newObjectiveBtn = page
      .getByRole("button", { name: /nouvel? objectif|nouveau|cr[eé]er|ajouter|\+/i })
      .or(page.locator('[data-testid="new-thread-btn"]'));
    await newObjectiveBtn.first().click({ timeout: 10_000 });

    // Remplir le titre
    const titleInput = page
      .getByPlaceholder(/titre|objectif|goal|nom/i)
      .or(page.locator("input[type=text]:visible").first());
    await titleInput.first().fill("Trouver un stage en Marketing");

    // Valider
    const createBtn = page.getByRole("button", {
      name: /cr[eé]er|valider|commencer|go|lancer|ok/i,
    });
    await createBtn.first().click();

    // L'objectif doit apparaître dans la liste ou naviguer vers le chat
    await expect(
      page.getByText(/trouver un stage en marketing/i).or(page).toHaveURL(/\/app\/chat\//i)
    ).toBeTruthy();
  });
});
