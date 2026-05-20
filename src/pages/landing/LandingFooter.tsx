import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone } from "lucide-react";

export function LandingFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("landing.footer_mission")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("landing.footer_tagline")}
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("landing.footer_product")}
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => navigate("/onboarding")}
                >
                  {t("landing.footer_signup")}
                </button>
              </li>
              <li>
                <button
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => navigate("/login")}
                >
                  {t("landing.footer_login")}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("landing.footer_contact_label")}
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@malaya.co"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  contact@malaya.co
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2250768026574"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  +225 07 68 02 65 74
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} Malayka. {t("landing.footer_rights")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("landing.footer_made_by")}{" "}
            <span className="font-semibold text-foreground">Yalna Technologies</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
