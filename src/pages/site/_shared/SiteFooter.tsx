import { Link, useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mailto, FlowChain } from "./ui";
import { useT, type Translate } from "./lang";

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function IconTikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

const SOCIALS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/malayka/", Icon: IconLinkedin },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61570779744958", Icon: IconFacebook },
  { name: "TikTok", href: "https://www.tiktok.com/@malayka.ia", Icon: IconTikTok },
];

type FooterLink = { label: string; to?: string; href?: string };

const buildColumns = (t: Translate): { title: string; links: FooterLink[] }[] => [
  {
    title: t("Produits", "Products"),
    links: [
      { label: "Malayka IA", to: "/produits/malayka-ia" },
      { label: "Malayka Éducative", to: "/produits/malayka-educative" },
      { label: "Malayka Data", to: "/produits/malayka-data" },
      { label: "Malayka Services", to: "/produits/malayka-services" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: t("Entreprises d'IA", "AI companies"), to: "/solutions/entreprises-ia" },
      { label: t("Gouvernements & ONG", "Governments & NGOs"), to: "/solutions/gouvernements" },
      { label: t("Bailleurs de fonds", "Funders"), to: "/solutions/gouvernements#bailleurs" },
      { label: t("Établissements & EdTech", "Institutions & EdTech"), to: "/solutions/etablissements" },
      { label: t("Particuliers", "Individuals"), to: "/solutions/particuliers" },
    ],
  },
  {
    title: "Data & Intelligence",
    links: [
      { label: "Data Engine", to: "/produits/malayka-data#data-engine" },
      { label: "Datasets", to: "/produits/malayka-data#datasets" },
      { label: "API", to: "/produits/malayka-data#api" },
      { label: "AI Training Data", to: "/solutions/entreprises-ia" },
      { label: t("Observatoire temps réel", "Real-time observatory"), to: "/solutions/gouvernements#observatoire" },
    ],
  },
  {
    title: t("Ressources", "Resources"),
    links: [
      { label: "Blog", to: "/ressources" },
      { label: t("Études", "Studies"), to: "/ressources" },
      { label: t("Rapports", "Reports"), to: "/ressources" },
      { label: "Documentation", href: mailto("Documentation API Malayka Data") },
    ],
  },
  {
    title: t("Entreprise", "Company"),
    links: [
      { label: t("À propos", "About"), to: "/a-propos" },
      { label: t("Notre approche", "Our approach"), to: "/a-propos#approche" },
      { label: t("Carrières", "Careers"), href: mailto("Carrières chez Malayka") },
      { label: t("Partenaires", "Partners"), to: "/a-propos" },
      { label: "Contact", href: mailto("Contact Malayka") },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: t("Confidentialité", "Privacy"), to: "/legal/privacy" },
      { label: t("Conditions", "Terms"), to: "/legal/terms" },
      { label: "Cookies", to: "/legal/privacy#art9" },
      { label: t("Données", "Your data"), to: "/legal/privacy#art8" },
    ],
  },
];

export function SiteFooter() {
  const navigate = useNavigate();
  const t = useT();
  const COLUMNS = buildColumns(t);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden border-t border-border bg-[#0a0a0a] text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[380px] w-[380px] rounded-full bg-primary/15 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        {/* Bandeau conversion */}
        <div className="flex flex-col gap-6 border-b border-border py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg">
            <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {t(
                "Comprendre le capital humain. Anticiper son évolution. Agir.",
                "Understand human capital. Anticipate how it moves. Act.",
              )}
            </h2>
            <FlowChain steps={["Data", "Intelligence", "Action"]} className="mt-5" />
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 rounded-xl px-6 font-semibold shadow-lg shadow-primary/25"
              onClick={() => navigate("/onboarding")}
            >
              {t("Commencer avec Malayka", "Get started with Malayka")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-6 font-semibold !border-border !bg-transparent !text-foreground hover:!bg-card"
              onClick={() => (window.location.href = mailto("Parler à l'équipe Malayka"))}
            >
              {t("Parler à notre équipe", "Talk to our team")}
            </Button>
          </div>
        </div>

        {/* Colonnes */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-border py-14 sm:grid-cols-3 lg:grid-cols-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to!} className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-border py-6">
          <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            {t(
              "13e Étage, Immeuble Postel 2001, Abidjan, Plateau",
              "13th floor, Immeuble Postel 2001, Abidjan, Plateau",
            )}
          </span>
          <a
            href={`mailto:contact@malayka.co`}
            className="flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
            contact@malayka.co
          </a>
          <a
            href="https://wa.me/2250509486382"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
            +225 05 09 48 63 82
          </a>
        </div>

        {/* Bas de page */}
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} Malayka · {t("Créé par", "Built by")}{" "}
            <span className="font-semibold text-muted-foreground">Yalna Technologies</span> ·{" "}
            {t("Tous droits réservés.", "All rights reserved.")}
          </p>
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
