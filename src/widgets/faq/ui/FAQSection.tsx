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
      className="w-full py-16 md:py-24 lg:py-32 bg-muted relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

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
