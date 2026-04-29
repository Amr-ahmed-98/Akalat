import Link from "next/link";
import { Award, BadgeCheck, Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/src/shared/ui/brand-logo";

type FooterProps = {
  locale: string;
};

const FOOTER_COLUMNS = [
  {
    namespace: "product",
    links: [
      { key: "scanner", href: "/scanner" },
      { key: "recipes", href: "/recipes" },
      { key: "pricing", href: "/pricing" },
    ],
  },
  {
    namespace: "company",
    links: [
      { key: "about", href: "/about" },
      { key: "blog", href: "/blog" },
    ],
  },
  {
    namespace: "resources",
    links: [
      { key: "helpCenter", href: "/help" },
      { key: "account", href: "/account" },
    ],
  },
  {
    namespace: "legal",
    links: [
      { key: "privacy", href: "/privacy" },
      { key: "terms", href: "/terms" },
    ],
  },
] as const;

const SOCIAL_ICONS = [
  { Icon: Globe, ariaKey: "social.website" as const },
  { Icon: BadgeCheck, ariaKey: "social.verified" as const },
  { Icon: Award, ariaKey: "social.awards" as const },
] as const;

export default async function Footer({ locale }: FooterProps) {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col items-center sm:col-span-3 sm:items-start lg:col-span-1 ">
            <BrandLogo tone="light" locale={locale === "ar" ? "ar" : "en"} />

            <p className="mt-4 max-w-[18rem] text-center text-sm leading-7 text-white/65 sm:text-left">
              {t("tagline")}
            </p>

            {/* Social icons */}
            <div className="mt-5 flex items-center justify-center gap-2.5 sm:justify-start">
              {SOCIAL_ICONS.map(({ Icon, ariaKey }) => (
                <a
                  key={ariaKey}
                  href="#"
                  aria-label={t(ariaKey)}
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/65 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.namespace} className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-white">
                {t(`${column.namespace}.title`)}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map(({ key, href }) => (
                  <li key={key}>
                    <Link
                      href={`/${locale}${href}`}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {t(`${column.namespace}.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="mt-12 border-t border-white/10" />

        {/* ── Copyright ── */}
        <p className="mt-6 text-center text-sm text-white/50">
          {t("copyrightPrefix")}{" "}
          <span className="font-bold text-primary">{t("copyrightBrand")}</span>
          {t("copyrightSuffix")}
        </p>
      </div>
    </footer>
  );
}
