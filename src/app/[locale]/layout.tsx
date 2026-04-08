import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import { Providers } from "@/src/app/providers";
import { getMessages } from "@/src/i18n/request";
import { getDirection, isSupportedLocale } from "@/src/shared/config/i18n";
import { cn } from "@/src/shared/lib/utils";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <div
          lang={locale}
          dir={getDirection(locale)}
          className={cn(
            "min-h-screen",
            locale === "ar" && "[font-family:var(--font-cairo)]",
          )}
        >
          {children}
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
