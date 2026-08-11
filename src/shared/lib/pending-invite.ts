/**
 * Mémorise le chemin de redirection Malayka Institution (invitation
 * enseignant ou lien de Classroom étudiant) pendant le détour par /login ou
 * /onboarding pour un invité non authentifié — restitué juste après
 * connexion/inscription pour reprendre le flow d'acceptation.
 */
const KEY = "malayka_pending_invite_redirect";

export const setPendingInviteRedirect = (path: string): void => {
  localStorage.setItem(KEY, path);
};

export const getPendingInviteRedirect = (): string | null => localStorage.getItem(KEY);

export const clearPendingInviteRedirect = (): void => {
  localStorage.removeItem(KEY);
};
