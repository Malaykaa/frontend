import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b last:border-b-0">
      <button
        className="flex w-full items-start justify-between gap-4 py-4 text-left transition-colors hover:text-primary"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-semibold leading-snug pr-2">{q}</span>
        <ChevronDown
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-5">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-6 bg-primary/40" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">FAQ</span>
          <span className="h-px w-6 bg-primary/40" />
        </div>

        <div className="text-center mb-7">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t("landing.faq_title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("landing.faq_subtitle")}</p>
        </div>

        <div className="rounded-2xl border bg-card px-6">
          {FAQ_KEYS.map((n) => (
            <FaqItem key={n} q={t(`landing.faq_l${n}_q`)} a={t(`landing.faq_l${n}_a`)} />
          ))}
        </div>
      </div>
    </section>
  );
}
