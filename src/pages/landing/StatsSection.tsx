import { useTranslation } from "react-i18next";
import { Users, Globe2, FileText } from "lucide-react";

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    { value: "10 000+", label: t("landing.stat_users"),    Icon: Users,     color: "text-primary bg-primary/10" },
    { value: "15+",     label: t("landing.stat_countries"), Icon: Globe2,    color: "text-emerald-600 bg-emerald-100" },
    { value: "50 000+", label: t("landing.stat_docs"),     Icon: FileText,  color: "text-amber-600 bg-amber-100" },
  ];

  return (
    <section className="border-y bg-muted/30 py-10">
      <div className="mx-auto max-w-4xl px-5">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map(({ value, label, Icon, color }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-foreground md:text-3xl">{value}</p>
              <p className="text-xs text-muted-foreground font-medium leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
