// src/widgets/pricing-section/ui/PricingToggle.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createContext, useContext, useState, type ReactNode } from "react";

type BillingPeriod = "monthly" | "yearly";

interface PricingToggleContextType {
  billingPeriod: BillingPeriod;
  setBillingPeriod: (period: BillingPeriod) => void;
}

const PricingToggleContext = createContext<PricingToggleContextType | null>(
  null,
);

export function usePricingToggle() {
  const context = useContext(PricingToggleContext);
  if (!context)
    throw new Error(
      "usePricingToggle must be used within PricingToggleProvider",
    );
  return context;
}

interface PricingToggleProviderProps {
  children: ReactNode;
}

interface PricingToggleProps {
  isArabic: boolean;
  monthlyLabel: string;
  yearlyLabel: string;
  discountLabel: string;
}

export function PricingToggleProvider({
  children,
}: PricingToggleProviderProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <PricingToggleContext.Provider value={{ billingPeriod, setBillingPeriod }}>
      {children}
    </PricingToggleContext.Provider>
  );
}

export function PricingToggle({
  isArabic,
  monthlyLabel,
  yearlyLabel,
  discountLabel,
}: PricingToggleProps) {
  const { billingPeriod, setBillingPeriod } = usePricingToggle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center gap-4 mb-12 md:mb-16"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Toggle Container */}
      <div className="relative flex items-center bg-card rounded-full p-1.5 shadow-lg border border-border/50">
        {/* Monthly Button */}
        <button
          onClick={() => setBillingPeriod("monthly")}
          className={`relative z-10 px-6 py-3 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${
            billingPeriod === "monthly"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {monthlyLabel}
        </button>

        {/* Yearly Button */}
        <button
          onClick={() => setBillingPeriod("yearly")}
          className={`relative z-10 px-6 py-3 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${
            billingPeriod === "yearly"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {yearlyLabel}
        </button>

        {/* Sliding Background */}
        <motion.div
          className="absolute top-1.5 bottom-1.5 bg-primary/10 rounded-full"
          initial={false}
          animate={{
            left: billingPeriod === "monthly" ? "0.375rem" : "50%",
            width: "calc(50% - 0.375rem)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>

      {/* Discount Badge */}
      <AnimatePresence>
        {billingPeriod === "yearly" && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-primary text-xs font-semibold">
              {discountLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
