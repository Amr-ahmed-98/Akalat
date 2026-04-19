// src/widgets/pro-features/ui/ProFeaturesSection.tsx

import { getTranslations } from "next-intl/server";
import { FeatureCard } from "./FeatureCard";
import { FloatingIcon } from "./FloatingIcon";

type ProFeaturesSectionProps = {
  locale: string;
};

type FeatureItem = {
  id: number;
  icon: string;
  title: string;
  description: string;
  badge: string | null;
  position: "left" | "right";
  gradient: string;
};

export async function ProFeaturesSection({ locale }: ProFeaturesSectionProps) {
  const t = await getTranslations("ProFeaturesSection");
  const isArabic = locale === "ar";

  const features: FeatureItem[] = [
    {
      id: 1,
      icon: "brain",
      title: t("features.ai.title"),
      description: t("features.ai.description"),
      badge: t("features.ai.badge"),
      position: "right",
      gradient: "from-primary to-accent",
    },
    {
      id: 2,
      icon: "mic",
      title: t("features.voice.title"),
      description: t("features.voice.description"),
      badge: null,
      position: "left",
      gradient: "from-accent to-primary",
    },
    {
      id: 3,
      icon: "chart",
      title: t("features.reports.title"),
      description: t("features.reports.description"),
      badge: t("features.reports.badge"),
      position: "right",
      gradient: "from-primary to-secondary",
    },
    {
      id: 4,
      icon: "calendar",
      title: t("features.planning.title"),
      description: t("features.planning.description"),
      badge: null,
      position: "left",
      gradient: "from-secondary to-primary",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-medium">
              {t("header.badge")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">{t("header.first")} </span>
            <span className="text-primary relative">
              {t("header.highlight")}
              <FloatingIcon />
            </span>
          </h2>
        </div>

        {/* Features Grid - Creative Layout */}
        <div className="relative">
          {/* Central connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary opacity-20" />

          {/* Features */}
          <div className="space-y-8 md:space-y-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                {...feature}
                delay={index * 150}
                isArabic={isArabic}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
