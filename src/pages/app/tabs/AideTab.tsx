import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-medium leading-snug">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t bg-muted/20 px-4 py-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function AideTab() {
  const { t } = useTranslation();

  const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className="flex flex-col px-4 py-5 space-y-6">
      <div>
        <h1 className="text-lg font-bold">{t("help.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("help.response_time")}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("help.contact_title")}
        </h2>

        <a
          href="https://wa.me/2250141112792"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors p-4 text-white"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm">{t("help.whatsapp")}</p>
            <p className="text-xs text-white/80 mt-0.5">{t("help.wa_phone")}</p>
            <p className="text-[10px] text-white/60 mt-0.5">{t("help.wa_response")}</p>
          </div>
          <ChevronDown className="ml-auto h-5 w-5 rotate-[-90deg] text-white/70" />
        </a>

        <div className="grid grid-cols-2 gap-2">
          <a
            href="mailto:contact@99eange.com"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 hover:bg-muted/30 transition-colors text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <Mail className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t("help.email")}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                contact@99eange.com
              </p>
            </div>
          </a>

          <a
            href="tel:+2250141112792"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 hover:bg-muted/30 transition-colors text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
              <Phone className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t("help.phone")}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                +225 01 41 11 27 92
              </p>
            </div>
          </a>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("help.faq_title")}
          </h2>
        </div>
        <div className="space-y-2">
          {FAQ_KEYS.map((n) => (
            <FaqItem
              key={n}
              q={t(`help.faq_${n}_q`)}
              a={t(`help.faq_${n}_a`)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4 text-center space-y-1">
        <p className="text-sm font-medium">{t("help.footer_name")}</p>
        <p className="text-xs text-muted-foreground">
          {t("help.footer_tagline", { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
}
