import { AppLayout } from "@/src/layouts/app-layout";
import { FAQSection } from "@/src/widgets/faq/ui/FAQSection";
import { PricingSection } from "@/src/widgets/pricing/ui/PricingSection";
import { ProFeaturesSection } from "@/src/widgets/pro-features/ui/ProFeaturesSection";
import { getTranslations } from "next-intl/server";

type PricingPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PricingPageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "PricingPage",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;

  return (
    <AppLayout locale={locale}>
      <PricingSection locale={locale} />
      <ProFeaturesSection locale={locale} />
      <FAQSection locale={locale} />
    </AppLayout>
  );
}
