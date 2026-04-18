import { AppLayout } from "@/src/layouts/app-layout";
import { HeroSection } from "@/src/widgets/hero/ui/HeroSection";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <AppLayout locale={locale}>
      <HeroSection locale={locale} />
    </AppLayout>
  );
}
