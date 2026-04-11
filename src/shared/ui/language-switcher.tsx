"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

import { locales, type Locale } from "@/src/shared/config/i18n";
import { cn } from "@/src/shared/lib/utils";

function buildLocalePath(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}`;
  }

  if (locales.includes(segments[0] as Locale)) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale() as Locale;
  const search = searchParams.toString();

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
      {locales.map((locale) => {
        const href = `${buildLocalePath(pathname, locale)}${
          search ? `?${search}` : ""
        }`;

        const active = currentLocale === locale;

        return (
          <Link
            key={locale}
            href={href}
            locale={"false"}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors  ",
              active
                ? "bg-primary text-primary-foreground"
                : "text-black font-bold  hover:text-muted-foreground",
            )}
          >
            {locale === "ar" ? "AR" : "EN"}
          </Link>
        );
      })}
    </div>
  );
}
