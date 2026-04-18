"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface StatsCardProps {
  isArabic: boolean;
  title: string;
  description: string;
}

export function StatsCard({ isArabic, title, description }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className="absolute -bottom-6 left-1/2 w-[calc(100%-3rem)] -translate-x-1/2 rounded-2xl border border-border/50 bg-card p-5 shadow-xl md:w-[calc(100%-4rem)] md:p-6 lg:w-[calc(100%-6rem)]"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.div
          className="shrink-0"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 8 }}
        >
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg md:text-xl font-bold text-foreground">
              {title}
            </span>
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
