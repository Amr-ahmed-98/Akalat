"use client";
import {
  HeartPulse,
  Mic,
  RefreshCw,
  ScanLine,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const featureIcons = {
  alternatives: RefreshCw,
  scanner: ScanLine,
  voice: Mic,
  shopping: ShoppingCart,
  nutrition: HeartPulse,
} as const;

export type FeatureIconName = keyof typeof featureIcons;

interface FeatureCardProps {
  icon: FeatureIconName;
  title: string;
  description: string;
  gradient: string;
  delay: number;
  isArabic: boolean;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
  isArabic,
  className = "",
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = featureIcons[Icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group ${className}`}
    >
      <div className="relative h-full bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Gradient background on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />

        {/* Animated border */}
        <div
          className={`absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon Container */}
          <motion.div
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${gradient} p-0.5 mb-6`}
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full h-full bg-card rounded-2xl md:rounded-3xl flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent
                  className={`w-8 h-8 md:w-10 md:h-10 text-transparent bg-clip-text bg-gradient-to-br ${gradient}`}
                  style={{ color: "var(--primary)" }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-xl"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.8 : 0.3,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Floating particles */}
        {isHovered && (
          <>
            <motion.div
              className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${gradient}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className={`absolute bottom-12 left-4 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${gradient}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -15],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
