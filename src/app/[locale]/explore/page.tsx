import { AppLayout } from "@/src/layouts/app-layout";
import { getTranslations } from "next-intl/server";

type ExplorePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ExplorePageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ExplorePage",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ExplorePage({ params }: ExplorePageProps) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-background">
      <AppLayout locale={locale}>
        <p>GG</p>
      </AppLayout>
    </main>
  );
}
