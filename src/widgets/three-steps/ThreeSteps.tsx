import { getTranslations } from "next-intl/server";

type ThreeStepsSectionProps = {
  locale: string;
};

export async function ThreeSteps({ locale }: ThreeStepsSectionProps) {
  const t = await getTranslations("ThreeStepsSection");
  const isArabic = locale === "ar";

  return (
    <section className="w-full bg-card py-16 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl">
            <span className="text-primary">{t("title.highlight")}</span>
            <span className="text-foreground"> {t("title.main")}</span>
          </h2>
          <p className="mx-auto max-w-2xl px-2 text-sm text-muted-foreground md:text-base lg:text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16">
          {/* Step 1 - Scan Ingredients */}
          <div className="flex flex-col items-center text-center group">
            {/* Number Circle */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl md:mb-8 md:h-20 md:w-20 lg:h-24 lg:w-24">
              <span className="text-2xl font-bold text-primary-foreground md:text-3xl lg:text-4xl">
                1
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-bold text-foreground md:mb-4 md:text-xl lg:text-2xl">
              {t("steps.scan.title")}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("steps.scan.description")}
            </p>
          </div>

          {/* Step 2 - AI Suggests Recipes */}
          <div className="flex flex-col items-center text-center group">
            {/* Number Circle */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl md:mb-8 md:h-20 md:w-20 lg:h-24 lg:w-24">
              <span className="text-2xl font-bold text-primary-foreground md:text-3xl lg:text-4xl">
                2
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-bold text-foreground md:mb-4 md:text-xl lg:text-2xl">
              {t("steps.ai.title")}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("steps.ai.description")}
            </p>
          </div>

          {/* Step 3 - Cook with Guidance */}
          <div className="flex flex-col items-center text-center group">
            {/* Number Circle */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl md:mb-8 md:h-20 md:w-20 lg:h-24 lg:w-24">
              <span className="text-2xl font-bold text-primary-foreground md:text-3xl lg:text-4xl">
                3
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-bold text-foreground md:mb-4 md:text-xl lg:text-2xl">
              {t("steps.cook.title")}
            </h3>

            {/* Description */}
            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("steps.cook.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
