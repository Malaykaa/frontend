const BASE_URL = import.meta.env.VITE_API_URL as string;

// ── Token en mémoire uniquement (jamais persisté en sessionStorage/localStorage) ──
// XSS ne peut pas exfiltrer le token : il n'est accessible que depuis ce module.
// La session survit aux navigations SPA (même onglet). Un rechargement de page
// déclenche un appel /auth/refresh via le cookie httpOnly pour restituer le token.
let _accessToken: string | null = null;

// ── Timer de refresh proactif ──────────────────────────────────────────────
// Planifie un refresh avant l'expiration du token pour éviter toute interruption
// pendant une conversation ou un stream SSE actif.
let _proactiveRefreshTimer: ReturnType<typeof setTimeout> | null = null;

function _parseTokenExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function _scheduleProactiveRefresh(token: string): void {
  if (_proactiveRefreshTimer !== null) {
    clearTimeout(_proactiveRefreshTimer);
    _proactiveRefreshTimer = null;
  }
  const expiresAt = _parseTokenExp(token);
  if (!expiresAt) return;

  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return;

  // Refresh à 80 % de la durée de vie restante (au minimum 30 s avant expiration)
  const delay = Math.max(remaining * 0.8, remaining - 30_000);
  _proactiveRefreshTimer = setTimeout(() => {
    doRefresh().catch(() => null); // silencieux — l'erreur sera gérée au prochain appel 401
  }, delay);
}

export function setToken(token: string): void {
  _accessToken = token;
  _scheduleProactiveRefresh(token);
}

export function clearToken(): void {
  _accessToken = null;
  if (_proactiveRefreshTimer !== null) {
    clearTimeout(_proactiveRefreshTimer);
    _proactiveRefreshTimer = null;
  }
}

export function getToken(): string | null {
  return _accessToken;
}

// Appelé par AuthContext au logout pour nettoyer le timer
export function clearRefreshSchedule(): void {
  if (_proactiveRefreshTimer !== null) {
    clearTimeout(_proactiveRefreshTimer);
    _proactiveRefreshTimer = null;
  }
}

// ── Refresh explicite — garantit un token frais avant de démarrer un stream SSE ──
// Si le token expire dans moins de 2 min, on rafraîchit maintenant.
export async function ensureFreshToken(): Promise<void> {
  const token = _accessToken;
  if (!token) {
    await doRefresh();
    return;
  }
  const expiresAt = _parseTokenExp(token);
  if (!expiresAt) return;
  if (expiresAt - Date.now() < 2 * 60 * 1000) {
    await doRefresh();
  }
}

// ── Mutex sur le refresh : une seule requête en vol à la fois ──────────────
let _refreshPromise: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000); // 8s max

  _refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    signal: controller.signal,
  })
    .then(async (res) => {
      clearTimeout(timer);
      if (!res.ok) throw new Error("refresh_failed");
      const data = (await res.json()) as { accessToken: string };
      setToken(data.accessToken);
      return data.accessToken;
    })
    .catch(() => {
      clearTimeout(timer);
      clearToken();
      return null;
    })
    .finally(() => {
      _refreshPromise = null;
    });

  return _refreshPromise;
}

// ── Erreur typée ──────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: Record<string, unknown>
  ) {
    super(
      (data?.detail as string) ??
        (data?.message as string) ??
        `HTTP ${status}`
    );
    this.name = "ApiError";
  }
}

// ── Client principal ──────────────────────────────────────────────────────
interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
  timeoutMs?: number;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, skipRefresh = false, timeoutMs = 15_000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(fetchOptions.headers as HeadersInit | undefined);

  if (!(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error).name === "AbortError") {
      throw new ApiError(408, { detail: "La requête a pris trop de temps. Réessaie." });
    }
    throw err;
  }
  clearTimeout(timer);

  // 401 → on tente le refresh une seule fois
  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const newToken = await doRefresh();
    if (!newToken) {
      clearToken();
      // Émet un event que AuthContext écoute — évite window.location qui casse la PWA standalone
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
      throw new ApiError(401, { detail: "Session expirée" });
    }
    headers.set("Authorization", `Bearer ${newToken}`);
    const retry = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
    });
    if (!retry.ok) {
      const errData = await retry.json().catch(() => ({}));
      throw new ApiError(retry.status, errData as Record<string, unknown>);
    }
    if (retry.status === 204) return undefined as T;
    return retry.json() as Promise<T>;
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errData as Record<string, unknown>);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// ── SSE streaming helper ───────────────────────────────────────────────────
export async function* apiStream(
  path: string,
  options: RequestOptions = {},
  timeoutMs = 60_000
): AsyncGenerator<string> {
  // Garantir un token frais avant d'ouvrir le stream : le backend valide le
  // token à la connexion initiale, pas pendant la diffusion. Un token qui
  // expirerait quelques secondes après le début du stream provoquerait une
  // coupure silencieuse. Ce check est rapide (no-op si le token est encore frais).
  await ensureFreshToken().catch(() => null);

  const { skipAuth = false, ...fetchOptions } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(fetchOptions.headers as HeadersInit | undefined);
  headers.set("Accept", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  if (fetchOptions.body && typeof fetchOptions.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error).name === "AbortError") {
      throw new ApiError(408, { detail: "La réponse de l'IA a pris trop de temps. Réessaie." });
    }
    throw err;
  }

  if (!response.ok || !response.body) {
    clearTimeout(timer);
    const errData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errData as Record<string, unknown>);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      clearTimeout(timer); // reset dès qu'on reçoit des données

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const payload = line.slice(6).trim();
          if (payload && payload !== "[DONE]") {
            yield payload;
          }
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new ApiError(408, { detail: "La réponse de l'IA a pris trop de temps. Réessaie." });
    }
    throw err;
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
