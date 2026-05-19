import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Aminata K.",
      role: t("landing.testimonial_1_role"),
      text: t("landing.testimonial_1_text"),
      avatar: "AK",
      color: "bg-sky-100 text-sky-700",
    },
    {
      name: "Serge M.",
      role: t("landing.testimonial_2_role"),
      text: t("landing.testimonial_2_text"),
      avatar: "SM",
      color: "bg-violet-100 text-violet-700",
    },
    {
      name: "Fatoumata D.",
      role: t("landing.testimonial_3_role"),
      text: t("landing.testimonial_3_text"),
      avatar: "FD",
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/20">
      <div className="mx-auto max-w-6xl px-5">

        {/* Header */}
        <div className="mx-auto max-w-xl text-center mb-14 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("landing.testimonials_title")}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm"
            >
              {/* Quote icon */}
              <Quote className="h-5 w-5 text-primary/30" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="flex-1 text-sm text-foreground leading-relaxed">
                "{item.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${item.color}`}>
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
