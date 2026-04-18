import { AppLayout } from "@/src/layouts/app-layout";
import { ChefSection } from "@/src/widgets/chef/ChefSection";
import { HeroSection } from "@/src/widgets/hero/ui/HeroSection";
import { SmartFeaturesSection } from "@/src/widgets/smart/ui/SmartFeaturesSection";
import { ThreeSteps } from "@/src/widgets/three-steps/ThreeSteps";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <AppLayout locale={locale}>
      <HeroSection locale={locale} />
      <ThreeSteps locale={locale} />
      <SmartFeaturesSection locale={locale} />
      <ChefSection locale={locale} />
    </AppLayout>
  );
}
