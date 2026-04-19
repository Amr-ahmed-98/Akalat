// src/widgets/pricing-section/ui/PricingCards.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePricingToggle } from "./PricingToggle";
import { Check } from "lucide-react";
import { useState } from "react";

interface PricingPlan {
  id: number;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  ctaHref?: string;
  popular: boolean;
}

interface PricingCardsProps {
  locale: string;
  isArabic: boolean;
  plans: PricingPlan[];
  popularLabel: string;
  currencyLabel: string;
  perMonthLabel: string;
  billedYearlyLabel: string;
  saveLabel: string;
}

export function PricingCards({
  locale,
  isArabic,
  plans,
  popularLabel,
  currencyLabel,
  perMonthLabel,
  billedYearlyLabel,
  saveLabel,
}: PricingCardsProps) {
  const { billingPeriod } = usePricingToggle();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const priceFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar-EG" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

  // Monthly equivalent when billed yearly (yearly total ÷ 12)
  const getDisplayPrice = (plan: PricingPlan) => {
    if (billingPeriod === "yearly" && plan.yearlyPrice > 0) {
      return plan.yearlyPrice / 12;
    }
    return plan.price;
  };

  const isYearlyWithDiscount = (plan: PricingPlan) =>
    billingPeriod === "yearly" && plan.price > 0 && plan.yearlyPrice > 0;

  const getSavingsPercent = (plan: PricingPlan) =>
    Math.round((1 - plan.yearlyPrice / 12 / plan.price) * 100);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-5 items-stretch"
    >
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onMouseEnter={() => setHoveredCard(plan.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className={`
            relative flex flex-col rounded-2xl md:rounded-3xl p-5 md:p-6
            ${
              plan.popular
                ? "bg-secondary text-white shadow-2xl scale-105 z-10"
                : "bg-card border border-border/50 shadow-lg hover:shadow-xl"
            }
            transition-all duration-300
          `}
        >
          {/* Popular Badge */}
          {plan.popular && (
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="px-4 py-1.5 bg-primary rounded-full text-white text-xs font-bold shadow-lg">
                {popularLabel}
              </span>
            </motion.div>
          )}

          {/* Plan Header */}
          <div className="text-center mb-4 pb-4 border-b border-border/20">
            <h3
              className={`mb-1 text-lg font-bold md:text-xl ${plan.popular ? "text-white" : "text-foreground"}`}
            >
              {plan.name}
            </h3>
            <p
              className={`text-xs ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}
            >
              {plan.description}
            </p>
          </div>

          {/* ── Price block ─────────────────────────────────────────────────
              All rows are ALWAYS rendered; invisible ones use opacity-0
              so every card has identical height here → prices align.        */}
          <div className="text-center mb-6">
            <motion.div
              key={billingPeriod}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Row 1 – Savings badge (reserved space even when hidden) */}
              <div className="h-6 flex items-center justify-center mb-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    isYearlyWithDiscount(plan)
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75 pointer-events-none"
                  } bg-primary text-card`}
                >
                  {saveLabel}{" "}
                  {isYearlyWithDiscount(plan) ? getSavingsPercent(plan) : 0}%
                </span>
              </div>

              {/* Row 2 – Original price crossed out (reserved space even when hidden) */}
              <p
                className={`text-sm line-through h-5 leading-5 mb-0.5 transition-opacity duration-300 ${
                  isYearlyWithDiscount(plan) ? "opacity-100" : "opacity-0"
                } ${plan.popular ? "text-white" : "text-black"}`}
              >
                {priceFormatter.format(plan.price)}{" "}
                <span className="text-xs">{currencyLabel}</span>
              </p>

              {/* Row 3 – Main (discounted) price */}
              <div className="flex items-baseline justify-center gap-1">
                <span
                  className={`text-3xl md:text-4xl font-bold ${plan.popular ? "text-white" : "text-foreground"}`}
                >
                  {priceFormatter.format(getDisplayPrice(plan))}
                </span>
                <span
                  className={`text-sm ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}
                >
                  {currencyLabel}
                </span>
              </div>

              {/* Row 4 – /month label (always shown so free plan stays aligned) */}
              <p
                className={`text-xs mt-0.5 h-4 leading-4 ${plan.popular ? "text-white/60" : "text-muted-foreground"}`}
              >
                {plan.price > 0 ? perMonthLabel : ""}
              </p>

              {/* Row 5 – "Billed yearly at X SAR" (reserved space even when hidden) */}
              <p
                className={`text-xs mt-1.5 h-4 leading-4 font-medium transition-opacity duration-300 ${
                  isYearlyWithDiscount(plan) ? "opacity-100" : "opacity-0"
                } ${plan.popular ? "text-primary" : "text-primary"}`}
              >
                {billedYearlyLabel} {priceFormatter.format(plan.yearlyPrice)}{" "}
                {currencyLabel}
              </p>
            </motion.div>
          </div>

          {/* Features — flex-1 pushes the button to the bottom.
              text-xs only (no md:text-sm) to prevent wrapping in Arabic
              narrow columns.                                                */}
          <ul className="mb-6 space-y-2.5 flex-1">
            {plan.features.map((feature, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-2 ${isArabic ? "text-right" : "text-left"}`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                    plan.popular ? "bg-primary" : "bg-primary/10"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${plan.popular ? "text-white" : "text-primary"}`}
                  />
                </div>
                <span
                  className={`text-xs leading-relaxed ${plan.popular ? "text-white/90" : "text-foreground/80"}`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA Button — always at the bottom.
              Free plan (ctaHref present) uses a Link; others are plain buttons. */}
          {plan.ctaHref ? (
            <Link href={plan.ctaHref} className="block w-full">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg"
                    : "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {plan.cta}
              </motion.span>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                plan.popular
                  ? "bg-primary text-white hover:bg-primary/90 shadow-lg"
                  : "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {plan.cta}
            </motion.button>
          )}

          {/* Hover Effect for Popular Card */}
          {plan.popular && (
            <motion.div
              className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"
              animate={{ opacity: hoveredCard === plan.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
