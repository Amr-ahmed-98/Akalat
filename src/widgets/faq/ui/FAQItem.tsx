// src/widgets/faq-section/ui/FAQItem.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/src/shared/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  delay: number;
  isArabic: boolean;
}

export function FAQItem({ question, answer, delay, isArabic }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden"
    >
      {/* Question Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-6 py-5 md:py-6",
          isArabic ? "text-right" : "text-left",
        )}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <span className="text-base md:text-lg font-semibold text-foreground flex-1">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 md:pb-6">
              <div className="pt-2 border-t border-border/30">
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-muted-foreground font-bold text-sm md:text-base leading-relaxed"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {answer}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
