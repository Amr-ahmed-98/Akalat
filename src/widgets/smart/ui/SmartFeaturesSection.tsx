import { getTranslations } from "next-intl/server";
import { FeatureCard, type FeatureIconName } from "./FeatureCard";

type SmartFeaturesSectionProps = {
  locale: string;
};

export async function SmartFeaturesSection({
  locale,
}: SmartFeaturesSectionProps) {
  const t = await getTranslations("SmartFeaturesSection");
  const isArabic = locale === "ar";

  const features = [
    {
      icon: "alternatives",
      title: t("features.alternatives.title"),
      description: t("features.alternatives.description"),
      gradient: "from-orange-500 to-amber-500",
      delay: 0,
    },
    {
      icon: "scanner",
      title: t("features.scanner.title"),
      description: t("features.scanner.description"),
      gradient: "from-blue-500 to-cyan-500",
      delay: 100,
    },
    {
      icon: "voice",
      title: t("features.voice.title"),
      description: t("features.voice.description"),
      gradient: "from-purple-500 to-pink-500",
      delay: 200,
    },
    {
      icon: "shopping",
      title: t("features.shopping.title"),
      description: t("features.shopping.description"),
      gradient: "from-green-500 to-emerald-500",
      delay: 300,
    },
    {
      icon: "nutrition",
      title: t("features.nutrition.title"),
      description: t("features.nutrition.description"),
      gradient: "from-red-500 to-rose-500",
      delay: 400,
    },
  ] satisfies Array<{
    icon: FeatureIconName;
    title: string;
    description: string;
    gradient: string;
    delay: number;
  }>;

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-primary">{t("title.highlight")}</span>
            <span className="text-foreground"> {t("title.main")}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={feature.delay}
              isArabic={isArabic}
              className={
                index === 0 || index === 1 ? "md:col-span-2 lg:col-span-1" : ""
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
