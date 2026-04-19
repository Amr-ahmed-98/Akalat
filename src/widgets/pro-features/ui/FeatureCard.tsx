// src/widgets/pro-features/ui/FeatureCard.tsx

"use client";

import { motion } from "framer-motion";
import { Mic, Brain, BarChart3, Calendar } from "lucide-react";

interface FeatureCardProps {
  id: number;
  icon: string;
  title: string;
  description: string;
  badge?: string | null;
  position: "left" | "right";
  gradient: string;
  delay: number;
  isArabic: boolean;
  index: number;
}

const iconMap = {
  brain: Brain,
  mic: Mic,
  chart: BarChart3,
  calendar: Calendar,
};

export function FeatureCard({
  icon,
  title,
  description,
  badge,
  position,
  gradient,
  delay,
  isArabic,
  index,
}: FeatureCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  const isRightAligned = isArabic ? position === "left" : position === "right";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="relative"
    >
      {/* Feature Number Badge */}
      <div
        className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 ${
          position === "right"
            ? "left-1/2 -translate-x-1/2"
            : "left-1/2 -translate-x-1/2"
        }`}
      >
        <motion.div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white font-bold text-lg">{index + 1}</span>
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className={`
          group relative bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 
          border border-border/50 shadow-lg hover:shadow-2xl
          transition-all duration-500
          ${isRightAligned ? "lg:ml-auto lg:w-[calc(50%-3rem)]" : "lg:mr-auto lg:w-[calc(50%-3rem)]"}
        `}
      >
        {/* Gradient border on hover */}
        <div
          className={`absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
          style={{ padding: "2px" }}
        >
          <div className="w-full h-full bg-card rounded-2xl md:rounded-3xl" />
        </div>

        {/* Card Content */}
        <div className="flex flex-col items-start gap-4">
          {/* Icon Container */}
          <motion.div
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${gradient} p-0.5`}
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
              {description}
            </p>

            {/* Badge */}
            {badge && (
              <motion.div
                className="inline-flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`w-8 h-0.5 bg-gradient-to-r ${gradient} rounded-full`}
                />
                <span className="text-primary font-semibold text-sm">
                  {badge}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-2xl md:rounded-tr-3xl">
          <div
            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
