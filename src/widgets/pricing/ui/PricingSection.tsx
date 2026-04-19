// src/widgets/pricing-section/ui/PricingSection.tsx

import { getTranslations } from "next-intl/server";
import { PricingHeader } from "./PricingHeader";
import { PricingToggle, PricingToggleProvider } from "./PricingToggle";
import { PricingCards } from "./PricingCards";

type PricingSectionProps = {
  locale: string;
};

export async function PricingSection({ locale }: PricingSectionProps) {
  const t = await getTranslations("PricingSection");
  const isArabic = locale === "ar";
  const direction = locale === "ar" ? "rtl" : "ltr";

  const plans = [
    {
      id: 0,
      name: t("plans.free.name"),
      price: 0,
      yearlyPrice: 0,
      description: t("plans.free.description"),
      features: [
        t("plans.free.features.0"),
        t("plans.free.features.1"),
        t("plans.free.features.2"),
      ],
      cta: t("plans.free.cta"),
      ctaHref: "/register",
      popular: false,
    },
    {
      id: 1,
      name: t("plans.basic.name"),
      price: 10.14,
      yearlyPrice: 97.34,
      description: t("plans.basic.description"),
      features: [
        t("plans.basic.features.0"),
        t("plans.basic.features.1"),
        t("plans.basic.features.2"),
        t("plans.basic.features.3"),
      ],
      cta: t("plans.basic.cta"),
      popular: false,
    },
    {
      id: 2,
      name: t("plans.advanced.name"),
      price: 20.25,
      yearlyPrice: 194.4,
      description: t("plans.advanced.description"),
      features: [
        t("plans.advanced.features.0"),
        t("plans.advanced.features.1"),
        t("plans.advanced.features.2"),
        t("plans.advanced.features.3"),
        t("plans.advanced.features.4"),
      ],
      cta: t("plans.advanced.cta"),
      popular: true,
    },
    {
      id: 3,
      name: t("plans.pro.name"),
      price: 100,
      yearlyPrice: 960,
      description: t("plans.pro.description"),
      features: [
        t("plans.pro.features.0"),
        t("plans.pro.features.1"),
        t("plans.pro.features.2"),
        t("plans.pro.features.3"),
        t("plans.pro.features.4"),
        t("plans.pro.features.5"),
      ],
      cta: t("plans.pro.cta"),
      popular: false,
    },
    {
      id: 4,
      name: t("plans.gold.name"),
      price: 200,
      yearlyPrice: 1920,
      description: t("plans.gold.description"),
      features: [
        t("plans.gold.features.0"),
        t("plans.gold.features.1"),
        t("plans.gold.features.2"),
        t("plans.gold.features.3"),
        t("plans.gold.features.4"),
        t("plans.gold.features.5"),
      ],
      cta: t("plans.gold.cta"),
      popular: false,
    },
  ];

  return (
    <section
      dir={direction}
      className="w-full py-16 md:py-24 lg:py-32 bg-muted relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <PricingHeader
          isArabic={isArabic}
          badge={t("header.badge")}
          first={t("header.first")}
          highlight={t("header.highlight")}
          description={t("header.description")}
        />
        <PricingToggleProvider>
          <PricingToggle
            isArabic={isArabic}
            monthlyLabel={t("toggle.monthly")}
            yearlyLabel={t("toggle.yearly")}
            discountLabel={t("toggle.discount")}
          />
          <PricingCards
            locale={locale}
            isArabic={isArabic}
            plans={plans}
            popularLabel={t("popular")}
            currencyLabel={t("currency")}
            perMonthLabel={t("perMonth")}
            billedYearlyLabel={t("billedYearly")}
            saveLabel={t("save")}
          />
        </PricingToggleProvider>
      </div>
    </section>
  );
}
