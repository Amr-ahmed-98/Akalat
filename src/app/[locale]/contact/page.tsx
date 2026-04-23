import { AppLayout } from "@/src/layouts/app-layout";
import { ContactSection } from "@/src/widgets/contact/ui/ContactSection";
import { getTranslations } from "next-intl/server";
import { FeedbackSection } from "@/src/widgets/feedback/ui/FeedbackSection";

type ContactPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ContactPage",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  return (
    <main className="min-h-screen bg-background">
      <AppLayout locale={locale}>
        <ContactSection locale={locale} />
        <FeedbackSection locale={locale} />
      </AppLayout>
    </main>
  );
}
