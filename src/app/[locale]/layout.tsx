// src/app/[locale]/layout.tsx — no html/body, just providers
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/src/i18n/request";
import { Providers } from "@/src/app/providers";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
