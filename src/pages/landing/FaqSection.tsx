import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b last:border-b-0">
      <button
        className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-primary"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-semibold leading-snug pr-2">{q}</span>
        <span className="shrink-0 mt-0.5 text-muted-foreground">
          {open
            ? <ChevronUp className="h-4 w-4" />
            : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">

        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("landing.faq_title")}
          </h2>
          <p className="text-base text-muted-foreground">{t("landing.faq_subtitle")}</p>
        </div>

        {/* Accordion */}
        <div className="rounded-2xl border bg-card px-6 divide-y-0">
          {FAQ_KEYS.map((n) => (
            <FaqItem
              key={n}
              q={t(`landing.faq_l${n}_q`)}
              a={t(`landing.faq_l${n}_a`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
