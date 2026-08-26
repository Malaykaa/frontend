import { ForWhom }    from "../ForWhom";
import { CtaSection } from "../CtaSection";

/**
 * Services — mise en relation entre prestataires et clients.
 *
 * C'est la partie marketplace : un particulier ou une entreprise decrit son
 * besoin, Malayka propose des prestataires, et les coordonnees ne circulent
 * qu'apres accord des deux parties.
 */
export default function ServicesPage() {
  return (
    <div className="pt-24 md:pt-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Services
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Trouver un prestataire, ou en devenir un
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Decrivez votre besoin, Malayka vous propose des prestataires adaptes. Vos
          coordonnees ne circulent qu'apres accord des deux parties — jamais avant.
        </p>
      </div>
      <ForWhom />
      <CtaSection />
    </div>
  );
}
