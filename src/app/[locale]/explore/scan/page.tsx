import { AppLayout } from "@/src/layouts/app-layout";
import { getTranslations } from "next-intl/server";

import { RequireAuth } from "@/src/features/auth/ui/RequireAuth";
import { IngredientScannerPage } from "@/src/widgets/ingredient-scanner/ui/IngredientScannerPage";

type ExploreScanPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ExploreScanPageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "IngredientScannerPage",
  });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function ExploreScanPage({ params }: ExploreScanPageProps) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-background">
      <AppLayout locale={locale}>
        <RequireAuth locale={locale}>
          <IngredientScannerPage />
        </RequireAuth>
      </AppLayout>
    </main>
  );
}
