import { AppLayout } from "@/src/layouts/app-layout";
import { getTranslations } from "next-intl/server";

type ExplorePageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: ExplorePageProps) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "ExplorePage",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ExplorePage({ params }: ExplorePageProps) {
  return (
    <main className="min-h-screen bg-background">
      <AppLayout locale={params.locale}>
        <p>GG</p>
      </AppLayout>
    </main>
  );
}
