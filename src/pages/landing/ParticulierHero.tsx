import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingSimulation } from "./LandingSimulation";

/**
 * Accueil Malayka Particulier.
 *
 * L'ancienne hero empilait trois halos colorés, un fond pointillé et un titre
 * en dégradé animé. Elle contredisait l'identité monochrome, et surtout elle
 * DÉCRIVAIT le produit au lieu de le montrer.
 *
 * Ici, le visuel EST le produit : la simulation rejoue une vraie conversation,
 * puis l'alerte WhatsApp qui suit. Un visiteur comprend en dix secondes ce
 * qu'il obtiendra — ce qu'aucun paragraphe ne réussit aussi bien.
 */
export function ParticulierHero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-24 pb-14 md:pt-32 md:pb-20">
      {/* Trame discrète, dans l'encre de la marque — pas de halo coloré. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("landing.badge")}
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              <span className="block text-muted-foreground">{t("landing.hero_headline")}</span>
              <span className="block">{t("landing.hero_headline_2")}</span>
            </h1>

            <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground lg:mx-0">
              {t("landing.hero_subtitle_v2")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" className="gap-2 font-semibold" onClick={() => navigate("/onboarding")}>
                {t("landing.nav_start")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                {t("landing.nav_login")}
              </Button>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("landing.hero_trust")}
            </p>
          </div>

          <div className="lg:pl-4">
            <LandingSimulation />
          </div>
        </div>
      </div>
    </section>
  );
}
