import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Briefcase, Search, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ForWhom() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const profiles = [
    {
      Icon: GraduationCap,
      color: "bg-sky-100 text-sky-600",
      border: "hover:border-sky-300",
      badge: "bg-sky-50 text-sky-700 border-sky-200",
      titleKey: "landing.for_student_title",
      bullets: ["landing.for_student_1", "landing.for_student_2", "landing.for_student_3"],
    },
    {
      Icon: Briefcase,
      color: "bg-violet-100 text-violet-600",
      border: "hover:border-violet-300",
      badge: "bg-violet-50 text-violet-700 border-violet-200",
      titleKey: "landing.for_pro_title",
      bullets: ["landing.for_pro_1", "landing.for_pro_2", "landing.for_pro_3"],
    },
    {
      Icon: Search,
      color: "bg-amber-100 text-amber-600",
      border: "hover:border-amber-300",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      titleKey: "landing.for_seeker_title",
      bullets: ["landing.for_seeker_1", "landing.for_seeker_2", "landing.for_seeker_3"],
    },
  ] as const;

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-5">

        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-12">

          {/* Left — profile cards */}
          <div className="flex-1 space-y-5">

            {/* Header */}
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {t("landing.for_whom_title")}
              </h2>
              <p className="text-base text-muted-foreground max-w-sm">
                {t("landing.for_whom_subtitle")}
              </p>
            </div>

            {profiles.map(({ Icon, color, border, badge, titleKey, bullets }) => (
              <div
                key={titleKey}
                className={`rounded-2xl border bg-card p-5 transition-all duration-200 ${border} hover:shadow-md cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-2.5 ${badge}`}>
                      {t(titleKey)}
                    </span>
                    <ul className="space-y-1.5">
                      {bullets.map((key) => (
                        <li key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                          {t(key)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <Button
              className="mt-6 gap-2 w-full sm:w-auto"
              onClick={() => navigate("/onboarding")}
            >
              {t("landing.cta_start")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right — second hero image */}
          <div className="flex justify-center md:justify-end shrink-0">
            <div className="relative">
              <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-amber-400/10 to-primary/8 blur-2xl" />
              <img
                src="/hero-woman-2.png"
                alt="Malayka pour toi"
                className="relative z-10 h-[340px] w-auto object-contain drop-shadow-xl md:h-[420px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
