import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Social icon SVGs ── */
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
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61570779744958", Icon: IconFacebook },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/malayka/",              Icon: IconLinkedin },
  { name: "TikTok",   href: "https://www.tiktok.com/@malayka.ia",                     Icon: IconTikTok   },
];

export function LandingFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #f0fdf4 0%, #ffffff 35%, #ecfdf5 65%, #f8fffe 100%)",
      }}
    >
      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #6ee7b7 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">

        {/* ── Main strip: Brand · Address · CTA ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-14 pb-10 border-b border-emerald-200/60">

          {/* 1 — Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Malayka" className="h-7 w-auto dark:invert" />
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("landing.footer_ai_status")}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("landing.footer_mission")}
            </p>

            <div className="flex items-center gap-3">
              <Link
                to="/legal/privacy"
                className="text-[11px] text-muted-foreground/60 hover:text-emerald-700 transition-colors duration-150 underline-offset-2 hover:underline"
              >
                {t("landing.footer_privacy")}
              </Link>
              <span className="text-muted-foreground/30 text-xs">·</span>
              <Link
                to="/legal/terms"
                className="text-[11px] text-muted-foreground/60 hover:text-emerald-700 transition-colors duration-150 underline-offset-2 hover:underline"
              >
                {t("landing.footer_terms")}
              </Link>
            </div>
          </div>

          {/* 2 — Contact */}
          <div className="space-y-4 md:border-x md:border-emerald-200/60 md:px-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700/70">
              {t("landing.footer_contact_label")}
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                <p className="text-sm text-muted-foreground leading-snug">
                  13e Étage, Immeuble Postel 2001<br />
                  Abidjan, Plateau
                </p>
              </div>

              <a
                href="mailto:contact@malayka.co"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                contact@malayka.co
              </a>

              <a
                href="https://wa.me/2250509486382"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                +225 05 09 48 63 82
              </a>
            </div>
          </div>

          {/* 3 — Mini CTA */}
          <div className="relative rounded-2xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur-sm p-5 overflow-hidden self-start">
            <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-300/20 blur-2xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-400/60 via-primary/40 to-transparent" />

            <p className="relative text-sm font-bold text-foreground leading-snug mb-1">
              {t("landing.footer_built_for")}
            </p>
            <p className="relative text-xs text-muted-foreground mb-4 leading-relaxed">
              {t("landing.footer_mission")}
            </p>
            <div className="relative flex gap-2 flex-wrap">
              <Button
                size="sm"
                className="gap-1.5 text-xs h-8 px-4 font-semibold shadow-md shadow-primary/20"
                onClick={() => navigate("/onboarding")}
              >
                {t("landing.footer_signup")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 px-3 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50"
                onClick={() => navigate("/login")}
              >
                {t("landing.footer_login")}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/70">
            © {year} Malayka ·{" "}
            <span>{t("landing.footer_made_by")} </span>
            <span className="font-semibold text-foreground/60">Yalna Technologies</span>
            <span className="mx-2 opacity-40">·</span>
            <span className="opacity-50">{t("landing.footer_rights")}</span>
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/40 hover:text-emerald-700 hover:bg-emerald-100 transition-all duration-150"
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
