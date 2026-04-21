"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

type ContactFAQItem = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  isArabic: boolean;
  title: string;
  chatButtonLabel: string;
  faqs: ContactFAQItem[];
  helpLabel: string;
}

export function FAQSection({
  isArabic,
  title,
  chatButtonLabel,
  faqs,
  helpLabel,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isArabic ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
        <h3 className="text-xl md:text-2xl font-bold text-foreground flex-1">
          {title}
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 px-4 py-2 bg-accent/10 text-primary rounded-full text-sm font-semibold hover:bg-accent/20 transition-colors duration-300"
        >
          {chatButtonLabel}
        </motion.button>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border border-border/50 rounded-xl overflow-hidden"
          >
            {/* Question */}
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-4 flex items-center justify-between gap-4 text-right bg-card hover:bg-muted/50 transition-colors duration-300"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <span className="text-sm md:text-base font-semibold text-foreground flex-1">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-primary" />
              </motion.div>
            </button>

            {/* Answer */}
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="pt-3 border-t border-border/50"
                    >
                      <p
                        className="text-muted-foreground font-bold text-sm md:text-base leading-relaxed"
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Bottom indicator */}
      <motion.div
        className="mt-6 pt-6 border-t border-border/50 flex items-center justify-center gap-2 text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle className="w-4 h-4" />
        <span>{helpLabel}</span>
      </motion.div>
    </motion.div>
  );
}
