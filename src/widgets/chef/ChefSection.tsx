import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FeatureItem } from "./FeatureItem";
import { StatsCard } from "./StatsCard";

type ChefSectionProps = {
  locale: string;
};

export async function ChefSection({ locale }: ChefSectionProps) {
  const t = await getTranslations("ChefSection");
  const isArabic = locale === "ar";

  const features = [
    {
      title: t("features.waste.title"),
      description: t("features.waste.description"),
    },
    {
      title: t("features.time.title"),
      description: t("features.time.description"),
    },
    {
      title: t("features.personalized.title"),
      description: t("features.personalized.description"),
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-card relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div className="relative order-2 lg:order-1">
            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={"/images/landing/chef-main.png"}
                alt={t("imageAlt")}
                width={600}
                height={700}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            {/* Stats Card - Positioned absolute */}
            <StatsCard
              isArabic={isArabic}
              title={t("stats.title")}
              description={t("stats.description")}
            />
          </div>

          {/* Content Column */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-foreground">{t("title.first")} </span>
                <span className="text-primary">{t("title.highlight")}</span>
                <span className="text-foreground"> {t("title.last")}</span>
              </h2>
              <div className="w-20 h-1.5 bg-linear-to-r from-primary to-accent rounded-full" />
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 150}
                  isArabic={isArabic}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
