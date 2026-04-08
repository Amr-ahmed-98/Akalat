import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Flame, ShieldCheck, Sparkles } from "lucide-react";
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
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,560px)]">
      <aside className="relative min-h-[300px] overflow-hidden lg:min-h-screen">
        <Image
          src="/images/auth/auth-hero.webp"
          alt={t("imageAlt")}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-secondary/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/35" />

        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6 lg:hidden">
          <BrandLogo tone="light" />
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 hidden h-full flex-col justify-between p-8 text-white lg:flex xl:p-10">
          <div className="flex items-center justify-between gap-6">
            <BrandLogo tone="light" />
            <LanguageSwitcher />
          </div>

          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Sparkles className="size-4" />
              <span>{t("heroBadge")}</span>
            </div>

            <h1 className="text-balance text-4xl font-black leading-tight sm:text-5xl xl:text-6xl">
              {t("heroTitle")}
            </h1>

            <p className="max-w-lg text-base text-white/80 sm:text-lg">
              {t("heroDescription")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 text-foreground shadow-2xl">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Sparkles className="size-4" />
                <span className="text-sm font-semibold">
                  {t("topCardLabel")}
                </span>
              </div>
              <p className="text-lg font-black">{t("topCardTitle")}</p>
            </div>

            <div className="rounded-3xl bg-white p-5 text-foreground shadow-2xl">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Flame className="size-4" />
                <span className="text-sm font-semibold">
                  {t("bottomCardLabel")}
                </span>
              </div>

              <div className="flex items-end gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("protein")}
                  </p>
                  <p className="text-xl font-black text-primary">12g</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("calories")}
                  </p>
                  <p className="text-xl font-black text-primary">340</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-10 xl:px-12">
          <div className="hidden items-center justify-between gap-6 lg:flex">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className={cn("size-4", isArabic && "rotate-180")} />
              {t("backHome")}
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm ring-1 ring-border">
              <ShieldCheck className="size-4 text-primary" />
              <span>{t("privacyNote")}</span>
            </div>
          </div>

          <div className="mb-6 mt-4 flex items-center justify-between gap-4 lg:hidden">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className={cn("size-4", isArabic && "rotate-180")} />
              {t("backHome")}
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm ring-1 ring-border">
              <ShieldCheck className="size-4 text-primary" />
              <span>{t("privacyNote")}</span>
            </div>
          </div>

          <div className="flex flex-1 items-center">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
