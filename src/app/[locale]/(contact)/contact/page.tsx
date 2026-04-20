import { AppLayout } from "@/src/layouts/app-layout";
import { ContactSection } from "@/src/widgets/contact/ui/ContactSection";
import { getTranslations } from "next-intl/server";
import { FeedbackSection } from "@/src/widgets/feedback/ui/FeedbackSection";

type ContactPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: ContactPageProps) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "ContactPage",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <AppLayout locale={params.locale}>
        <ContactSection locale={params.locale} />
        <FeedbackSection locale={params.locale} />
      </AppLayout>
    </main>
  );
}
