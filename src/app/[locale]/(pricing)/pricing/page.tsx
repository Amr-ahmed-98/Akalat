import { AppLayout } from "@/src/layouts/app-layout";
import { PricingSection } from "@/src/widgets/pricing/ui/PricingSection";
import { ProFeaturesSection } from "@/src/widgets/pro-features/ui/ProFeaturesSection";

type PricingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;

  return (
    <AppLayout locale={locale}>
      <PricingSection locale={locale} />
      <ProFeaturesSection locale={locale} />
    </AppLayout>
  );
}
