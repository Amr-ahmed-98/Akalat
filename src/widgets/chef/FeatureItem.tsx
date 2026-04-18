"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface FeatureItemProps {
  title: string;
  description: string;
  delay: number;
  isArabic: boolean;
}

export function FeatureItem({
  title,
  description,
  delay,
  isArabic,
}: FeatureItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isArabic ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="flex gap-4 group"
    >
      {/* Icon */}
      <motion.div
        className="shrink-0"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
