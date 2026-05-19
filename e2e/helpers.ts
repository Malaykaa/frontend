import { type APIRequestContext, type Page, expect } from "@playwright/test";

const API_URL = "http://localhost:8000";

/** Génère un numéro de téléphone unique pour chaque run */
export function uniquePhone(): string {
  const suffix = Date.now().toString().slice(-7);
  return `+225070${suffix}`;
}

/** Crée un compte via API et retourne le token + phone */
export async function createAccount(
  request: APIRequestContext,
  phone = uniquePhone(),
  password = "Test@12345"
): Promise<{ phone: string; password: string; token: string }> {
  // Envoyer OTP
  const otpRes = await request.post(`${API_URL}/auth/send-otp`, {
    data: { phone },
  });
  expect(otpRes.status()).toBe(200);
  const { dev_code } = await otpRes.json() as { dev_code: string };

  // Créer le compte
  const regRes = await request.post(`${API_URL}/auth/verify-otp-register`, {
    data: { phone, code: dev_code, password },
  });
  expect(regRes.status()).toBe(201);
  const { accessToken } = await regRes.json() as { accessToken: string };

  return { phone, password, token: accessToken };
}

/** Connecte un utilisateur existant via l'UI (page Login) */
export async function loginViaUI(
  page: Page,
  phone: string,
  password: string
): Promise<void> {
  await page.goto("/login");
  // Champ identifiant (email ou téléphone)
  const identifierInput = page.getByPlaceholder(/email.*téléphone|phone.*email|contact/i)
    .or(page.locator("input[type=text]").first());
  await identifierInput.fill(phone);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: /connexion|se connecter|login/i }).click();
  // Attendre la redirection vers /app
  await expect(page).toHaveURL(/\/app/, { timeout: 10_000 });
}

/** Crée un thread via API */
export async function createThread(
  request: APIRequestContext,
  token: string,
  title: string,
  presetKey?: string
): Promise<string> {
  const res = await request.post(`${API_URL}/chat/threads`, {
    data: { title, preset_key: presetKey ?? null },
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.status()).toBe(201);
  const data = await res.json() as { id: string };
  return data.id;
}
