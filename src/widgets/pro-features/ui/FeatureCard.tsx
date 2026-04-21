// src/widgets/pro-features/ui/FeatureCard.tsx

"use client";

import { motion, type Variants } from "framer-motion";
import { Mic, Brain, BarChart3, Calendar } from "lucide-react";

const iconMap = {
  brain: Brain,
  mic: Mic,
  chart: BarChart3,
  calendar: Calendar,
};

type FeatureIconName = keyof typeof iconMap;

interface FeatureCardProps {
  id: number;
  icon: FeatureIconName;
  title: string;
  description: string;
  badge?: string | null;
  position: "left" | "right";
  gradient: string;
  delay: number;
  isArabic: boolean;
  index: number;
}

const hoverTransition = { duration: 0.3, ease: "easeOut" } as const;

const cardVariants: Variants = {
  rest: { y: 0, transition: hoverTransition },
  hover: { y: -6, transition: hoverTransition },
};

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0, transition: hoverTransition },
  hover: {
    scale: 1.1,
    rotate: 6,
    transition: hoverTransition,
  },
};

const numberVariants: Variants = {
  rest: { scale: 1, transition: hoverTransition },
  hover: { scale: 1.15, transition: hoverTransition },
};

export function FeatureCard({
  icon,
  title,
  description,
  badge,
  gradient,
  delay,
  index,
}: FeatureCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="h-full"
    >
      <motion.div
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        className="group relative h-full bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border/50 shadow-md hover:shadow-xl hover:border-primary/25 transition-colors duration-400 overflow-hidden"
      >
        {/* Subtle gradient wash on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none`}
        />

        {/* Card Content */}
        <div className="relative flex flex-col gap-5">
          {/* Top row: icon + step number */}
          <div className="flex items-center justify-between">
            {/* Icon */}
            <motion.div
              variants={iconVariants}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${gradient} p-px`}
            >
              <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>
            </motion.div>

            {/* Step Number */}
            <motion.div
              variants={numberVariants}
              className="w-9 h-9 rounded-full border border-primary/25 bg-primary/8 flex items-center justify-center"
            >
              <span className="text-primary font-bold text-sm leading-none select-none">
                {index + 1}
              </span>
            </motion.div>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Badge */}
          {badge && (
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-px bg-gradient-to-r ${gradient} rounded-full`}
              />
              <span className="text-primary font-semibold text-sm">
                {badge}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
