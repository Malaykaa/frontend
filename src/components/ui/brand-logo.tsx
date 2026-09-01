import { cn } from "@/shared/lib/utils";

interface BrandLogoProps {
  className?: string;
}

/**
 * Le logo Malayka n'est pas monochrome (accent vert de la marque) : un
 * simple filtre CSS `invert` en mode sombre inverserait aussi le vert.
 * On bascule donc entre deux fichiers — texte noir / texte blanc — plutôt
 * que d'inverser les couleurs.
 */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <>
      <img src="/logo.png" alt="Malayka" className={cn(className, "dark:hidden")} />
      <img src="/logo-dark.png" alt="Malayka" className={cn(className, "hidden dark:block")} />
    </>
  );
}
