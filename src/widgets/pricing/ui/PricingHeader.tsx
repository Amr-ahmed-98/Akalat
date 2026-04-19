// src/widgets/pricing-section/ui/PricingHeader.tsx

"use client";

import { motion } from "framer-motion";

interface PricingHeaderProps {
  isArabic: boolean;
  badge: string;
  first: string;
  highlight: string;
  description: string;
}

export function PricingHeader({
  isArabic,
  badge,
  first,
  highlight,
  description,
}: PricingHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 md:mb-16"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6"
        whileHover={{ scale: 1.05 }}
      >
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-primary font-semibold text-sm">{badge}</span>
      </motion.div>

      {/* Main Heading */}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 ${
          isArabic ? "leading-[1.35]" : "leading-tight"
        }`}
      >
        <span className="text-foreground">{first} </span>
        <span className="text-primary">{highlight}</span>
      </h2>

      {/* Subtitle */}
      <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
