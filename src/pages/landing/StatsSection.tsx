import { useTranslation } from "react-i18next";
import { Clock, Zap, Sparkles, Globe2, Radio, Target } from "lucide-react";

const STATS = [
  { value: "12 jours", labelKey: "landing.stat_time_to_result",  Icon: Clock,     color: "text-sky-500",     bg: "bg-sky-500/10"     },
  { value: "8 sec",    labelKey: "landing.stat_doc_speed",       Icon: Zap,       color: "text-amber-500",   bg: "bg-amber-500/10"   },
  { value: "91%",      labelKey: "landing.stat_match_accuracy",  Icon: Sparkles,  color: "text-violet-500",  bg: "bg-violet-500/10"  },
  { value: "+47 000",  labelKey: "landing.stat_opps_per_day",    Icon: Globe2,    color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "+120",     labelKey: "landing.stat_sources",         Icon: Radio,     color: "text-rose-500",    bg: "bg-rose-500/10"    },
  { value: "+600",     labelKey: "landing.stat_goals_per_day",   Icon: Target,    color: "text-primary",     bg: "bg-primary/10"     },
] as const;

export function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-zinc-950 py-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-zinc-800 divide-y lg:divide-y-0 lg:divide-x sm:divide-x-0">
          {STATS.map(({ value, labelKey, Icon, color, bg }) => (
            <div key={labelKey} className="flex flex-col items-center gap-2 py-6 px-3 text-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`font-mono text-2xl font-extrabold tabular-nums leading-none ${color}`}>{value}</p>
              <p className="text-[10px] font-medium leading-snug text-zinc-400 max-w-[90px]">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
