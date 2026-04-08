import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthLayout } from "@/src/layouts/auth-layout";
import { isSupportedLocale, type Locale } from "@/src/shared/config/i18n";

type AuthRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const metadataByLocale: Record<Locale, Metadata> = {
  ar: {
    title: "بوابات الحساب",
    description: "تسجيل الدخول وإنشاء الحساب واستعادة كلمة المرور في أكالات.",
  },
  en: {
    title: "Account access",
    description: "Login, register and recover your Akalat account.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return metadataByLocale.ar;
  }

  return metadataByLocale[locale];
}

export default async function AuthRouteLayout({
  children,
  params,
}: AuthRouteLayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <AuthLayout locale={locale}>{children}</AuthLayout>;
}
