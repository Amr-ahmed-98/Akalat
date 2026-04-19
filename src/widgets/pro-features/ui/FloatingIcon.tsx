// src/widgets/pro-features/ui/FloatingIcon.tsx

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function FloatingIcon() {
  return (
    <motion.div
      className="absolute -top-4 -right-4 md:-top-6 md:-right-6"
      animate={{
        y: [0, -8, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent" />
    </motion.div>
  );
}
