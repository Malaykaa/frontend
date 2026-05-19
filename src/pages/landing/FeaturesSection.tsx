import { useTranslation } from "react-i18next";
import {
  Target, Sparkles, FileText,
  GraduationCap, Briefcase, MessageCircle,
} from "lucide-react";

const FEATURES = [
  { Icon: Target,        color: "bg-violet-100 text-violet-600",   titleKey: "landing.feature_1_title", descKey: "landing.feature_1_desc" },
  { Icon: Sparkles,      color: "bg-amber-100 text-amber-600",     titleKey: "landing.feature_2_title", descKey: "landing.feature_2_desc" },
  { Icon: FileText,      color: "bg-emerald-100 text-emerald-600", titleKey: "landing.feature_3_title", descKey: "landing.feature_3_desc" },
  { Icon: GraduationCap, color: "bg-sky-100 text-sky-600",         titleKey: "landing.feature_4_title", descKey: "landing.feature_4_desc" },
  { Icon: Briefcase,     color: "bg-rose-100 text-rose-600",       titleKey: "landing.feature_5_title", descKey: "landing.feature_5_desc" },
  { Icon: MessageCircle, color: "bg-green-100 text-green-600",     titleKey: "landing.feature_6_title", descKey: "landing.feature_6_desc" },
] as const;

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">

        {/* Header */}
        <div className="mx-auto max-w-xl text-center mb-14 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("landing.features_title")}
          </h2>
          <p className="text-base text-muted-foreground">
            {t("landing.features_subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, color, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="group flex gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} transition-transform group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{t(titleKey)}</p>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {t(descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
