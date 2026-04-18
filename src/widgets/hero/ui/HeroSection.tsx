import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/button";
import { HeroMockup } from "./HeroMockup";

type HeroSectionProps = {
  locale: string;
};

export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations("HeroSection");
  const isArabic = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-[#eef3f2]">
      {/* ── Subtle radial glow in the background ── */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/*
         * Two-column layout:
         * - RTL (ar): text on right (order-2 lg:order-none), mockup on left
         * - LTR (en): text on left, mockup on right
         */}
        <div
          className={cn(
            "flex flex-col items-center gap-14 lg:grid lg:items-center lg:gap-20",
            isArabic
              ? "lg:grid-cols-[1fr_minmax(0,1.08fr)]"
              : "lg:grid-cols-[minmax(0,1.08fr)_1fr]",
          )}
        >
          {/* ══ MOCKUP column ══ */}
          <div
            className={cn(
              "w-full",
              /* On mobile always first; on desktop mirror per locale */
              isArabic ? "lg:order-1" : "lg:order-2",
            )}
          >
            <HeroMockup />
          </div>

          {/* ══ TEXT column ══ */}
          <div
            className={cn(
              "flex w-full flex-col items-center text-center lg:items-start lg:text-start",
              isArabic ? "lg:order-2 lg:items-end lg:text-end" : "lg:order-1",
            )}
          >
            {/* ── Badge ── */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>{t("badge")}</span>
            </div>

            {/* ── Heading ── */}
            <h1
              className={cn(
                "mt-5 text-4xl font-black leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem]",
                isArabic && "leading-[1.25]",
              )}
            >
              <span className="block">{t("headingLine1")}</span>
              <span className="block">{t("headingLine2")}</span>
              <span className="block text-primary">{t("headingLine3")}</span>
            </h1>

            {/* ── Description ── */}
            <p
              className={cn(
                "mt-5 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8",
                isArabic && "max-w-lg",
              )}
            >
              {t("description")}
            </p>

            {/* ── CTA buttons ── */}
            <div
              className={cn(
                "mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4",
                isArabic && "sm:flex-row-reverse lg:flex-row-reverse",
              )}
            >
              {/* Primary */}
              <Button
                asChild
                className="h-12 rounded-full px-7 text-base font-bold shadow-[0_8px_24px_rgba(251,90,42,0.32)] transition-shadow hover:shadow-[0_12px_32px_rgba(251,90,42,0.42)]"
              >
                <Link href={`/${locale}/register`}>{t("ctaPrimary")}</Link>
              </Button>

              {/* Secondary */}
              <Button
                asChild
                variant="outline"
                className="h-12 gap-2.5 rounded-full border-2 border-border px-7 text-base font-bold transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Link href={`/${locale}/explore`}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Play className="h-3 w-3 translate-x-px" />
                  </span>
                  {t("ctaSecondary")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
