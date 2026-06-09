import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest, setToken, clearToken, clearRefreshSchedule } from "@/shared/api/client";
import type { User, Profile } from "@/shared/types";

// ── Types ──────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (identifier: string, password: string) => Promise<User>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtpRegister: (phone: string, code: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface LoginResponse {
  accessToken: string;
  user: User;
  profile: Profile | null;
}

interface MeResponse {
  user: User;
  profile: Profile | null;
}

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Écoute la session expirée depuis client.ts (évite window.location qui casse la PWA)
  useEffect(() => {
    const handler = () => {
      clearToken();
      setState({ user: null, profile: null, isLoading: false, isAuthenticated: false });
    };
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, []);

  // Restauration de session au démarrage via le cookie httpOnly.
  //
  // Flux :
  //   1. POST /auth/refresh → échange le cookie refresh contre un nouvel access token.
  //      Si le cookie est absent ou expiré, l'utilisateur voit la page de connexion.
  //   2. GET /auth/me + GET /profile en parallèle avec le token frais.
  //
  // Sans l'étape 1, un rechargement de page (F5, lien externe, fermeture/réouverture
  // d'onglet) effacerait le token en mémoire et forcerait une reconnexion — même si
  // le cookie de 30 jours est toujours valide.
  useEffect(() => {
    const timeout = setTimeout(() => {
      clearToken();
      setState((s) => ({ ...s, isLoading: false }));
    }, 10_000);

    (async () => {
      try {
        // 1. Obtenir un access token frais depuis le cookie httpOnly
        const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          // Cookie absent ou expiré → login requis (comportement normal)
          clearTimeout(timeout);
          clearToken();
          setState((s) => ({ ...s, isLoading: false }));
          return;
        }

        const { accessToken } = await refreshRes.json() as { accessToken: string };
        setToken(accessToken); // planifie aussi le refresh proactif

        // 2. Charger le profil utilisateur en parallèle
        const [meData, profileData] = await Promise.all([
          apiRequest<MeResponse>("/auth/me", { skipRefresh: true }),
          apiRequest<{ profile: Profile | null }>("/profile", { skipRefresh: true })
            .catch(() => ({ profile: null })),
        ]);

        clearTimeout(timeout);
        setState({
          user: meData.user,
          profile: profileData.profile,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        clearTimeout(timeout);
        clearToken();
        setState((s) => ({ ...s, isLoading: false }));
      }
    })();

    return () => clearTimeout(timeout);
  }, []);

  const login = useCallback(async (identifier: string, password: string): Promise<User> => {
    const isPhone = /^\+?[\d\s\-()]{7,}$/.test(identifier.trim());
    const endpoint = isPhone ? "/auth/login-phone" : "/auth/login";
    const body = isPhone
      ? { phone: identifier.trim(), password }
      : { email: identifier.trim(), password };

    const data = await apiRequest<LoginResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    });

    setToken(data.accessToken);
    queryClient.clear();
    setState({
      user: data.user,
      profile: null,
      isLoading: false,
      isAuthenticated: true,
    });
    return data.user;
  }, [queryClient]);

  const sendOtp = useCallback(async (phone: string) => {
    await apiRequest("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
      skipAuth: true,
    });
  }, []);

  const verifyOtpRegister = useCallback(
    async (phone: string, code: string, password: string) => {
      const data = await apiRequest<LoginResponse>("/auth/verify-otp-register", {
        method: "POST",
        body: JSON.stringify({ phone, code, password }),
        skipAuth: true,
      });
      setToken(data.accessToken);
      // Vider le cache : nouveau compte = données fraîches uniquement.
      queryClient.clear();
      setState({
        user: data.user,
        profile: data.profile,
        isLoading: false,
        isAuthenticated: true,
      });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => null);
    clearToken();
    clearRefreshSchedule(); // stoppe le timer de refresh proactif
    queryClient.clear();
    setState({ user: null, profile: null, isLoading: false, isAuthenticated: false });
  }, [queryClient]);

  const refreshProfile = useCallback(async () => {
    // /auth/me ne retourne que user (pas profile) → appel séparé /profile
    const [meData, profileData] = await Promise.all([
      apiRequest<MeResponse>("/auth/me"),
      apiRequest<{ profile: Profile | null }>("/profile").catch(() => ({ profile: null })),
    ]);
    setState((s) => ({ ...s, user: meData.user, profile: profileData.profile }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, sendOtp, verifyOtpRegister, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
