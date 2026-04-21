// src/widgets/faq-section/ui/FAQSection.tsx

import { getTranslations } from "next-intl/server";
import { FAQItem } from "./FAQItem";

type FAQSectionProps = {
  locale: string;
};

type FAQMessage = {
  question: string;
  answer: string;
};

export async function FAQSection({ locale }: FAQSectionProps) {
  const t = await getTranslations("FAQSection");
  const isArabic = locale === "ar";
  const faqs = t.raw("questions") as FAQMessage[];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full py-16  bg-muted relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t("title")}
          </h2>
          <div className="mt-4 w-20 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              delay={index * 100}
              isArabic={isArabic}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
