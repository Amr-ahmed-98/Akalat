import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/src/shared/config/i18n";
import { cn } from "@/src/shared/lib/utils";
import { BrandLogo } from "@/src/shared/ui/brand-logo";
import { LanguageSwitcher } from "@/src/shared/ui/language-switcher";

type AuthLayoutProps = {
  children: React.ReactNode;
  locale: Locale;
};

export async function AuthLayout({ children, locale }: AuthLayoutProps) {
  const t = await getTranslations({
    locale,
    namespace: "Auth.layout",
  });

  const isArabic = locale === "ar";

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,540px)] xl:grid-cols-[minmax(0,1.08fr)_minmax(440px,560px)]">
      <aside className="relative min-h-90 overflow-hidden lg:sticky lg:top-0 lg:h-screen lg:min-h-screen">
        <Image
          src="/images/auth/auth-hero.webp"
          alt={t("imageAlt")}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-secondary/76" />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-black/35" />

        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6 lg:hidden">
          <BrandLogo tone="light" locale={locale} />
          <LanguageSwitcher />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 pt-24 text-white sm:px-6 lg:hidden">
          <div className="max-w-[24rem] space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Sparkles className="size-4" />
              <span>{t("heroBadge")}</span>
            </div>

            <div className="space-y-3">
              <h1
                className={cn(
                  "line-clamp-3 text-3xl font-black leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]",
                  locale === "en" ? "max-w-[18ch]" : "max-w-[13ch]",
                )}
              >
                {t("heroTitle")}
              </h1>

              <p className="max-w-lg text-sm text-white/82 sm:text-base">
                {t("heroDescription")}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 hidden h-full flex-col p-8 text-white lg:flex xl:p-10">
          <div className="flex items-center justify-between gap-6">
            <BrandLogo tone="light" locale={locale} />
            <LanguageSwitcher />
          </div>

          <div className="flex flex-1 items-center py-8">
            <div className="w-full max-w-156 space-y-8 xl:space-y-10">
              <div className="max-w-152 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  <Sparkles className="size-4" />
                  <span>{t("heroBadge")}</span>
                </div>

                <h1
                  className={cn(
                    "font-black",
                    locale === "en"
                      ? "max-w-[21ch] text-[clamp(2.65rem,3.8vw,3.6rem)] leading-[1.08] tracking-[-0.03em]"
                      : "max-w-[12ch] text-[clamp(2.8rem,4vw,3.75rem)] leading-[1.2] tracking-normal",
                  )}
                >
                  {t("heroTitle")}
                </h1>

                <p className="max-w-136 text-base text-white/82 xl:text-lg">
                  {t("heroDescription")}
                </p>
              </div>

              <div className="flex h-full flex-col justify-between rounded-2xl bg-white/95 p-5 text-slate-700 shadow-[0_20px_55px_rgba(0,0,0,0.22)] backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white shadow-sm">
                    <Sparkles className="size-5" />
                  </span>

                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-primary">
                      {t("topCardLabel")}
                    </p>
                    <p className="text-base font-light leading-7 text-sidebar-accent-foreground">
                      {t("topCardTitle")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-136 flex-1 flex-col px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8 lg:py-8 xl:px-10">
          <div className="hidden items-center lg:flex">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className={cn("size-4", isArabic && "rotate-180")} />
              {t("backHome")}
            </Link>
          </div>

          <div className="mb-6 mt-4 flex items-center lg:hidden">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 whites1pace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className={cn("size-4", isArabic && "rotate-180")} />
              {t("backHome")}
            </Link>
          </div>

          <div className="flex flex-1 items-center py-2">
            <div className="w-full">{children}</div>
          </div>

          <div className="flex justify-center pt-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-center text-xs text-foreground shadow-sm ring-1 ring-border">
              <ShieldCheck className="size-4 text-primary" />
              <span>{t("privacyNote")}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
