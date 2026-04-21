import { getTranslations } from "next-intl/server";
import { QuickSolutions } from "./QuickSolutions";
import { FAQSection } from "./FAQSection";

type ContactSectionProps = {
  locale: string;
};

type QuickSolutionItem = {
  id: number;
  title: string;
  description: string;
};

type ContactFAQItem = {
  question: string;
  answer: string;
};

export async function ContactSection({ locale }: ContactSectionProps) {
  const t = await getTranslations("ContactSection");
  const isArabic = locale === "ar";
  const quickSolutions: QuickSolutionItem[] = [
    {
      id: 1,
      title: t("quickSolutions.login.title"),
      description: t("quickSolutions.login.description"),
    },
    {
      id: 2,
      title: t("quickSolutions.sync.title"),
      description: t("quickSolutions.sync.description"),
    },
    {
      id: 3,
      title: t("quickSolutions.billing.title"),
      description: t("quickSolutions.billing.description"),
    },
  ];
  const faqs = t.raw("faq.questions") as ContactFAQItem[];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full py-16  bg-muted relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Quick Solutions - Sidebar */}
          <div className="lg:col-span-4">
            <QuickSolutions
              isArabic={isArabic}
              title={t("quickSolutions.title")}
              items={quickSolutions}
            />
          </div>

          {/* FAQ Section - Main Content */}
          <div className="lg:col-span-8">
            <FAQSection
              isArabic={isArabic}
              title={t("faq.title")}
              chatButtonLabel={t("faq.chatButton")}
              faqs={faqs}
              helpLabel={t("faq.needHelp")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
