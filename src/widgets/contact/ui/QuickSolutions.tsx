"use client";

import { motion } from "framer-motion";
import { LogIn, RefreshCw, CreditCard } from "lucide-react";

type QuickSolutionItem = {
  id: number;
  title: string;
  description: string;
};

interface QuickSolutionsProps {
  isArabic: boolean;
  title: string;
  items: QuickSolutionItem[];
}

const quickLinks = [
  {
    id: 1,
    icon: LogIn,
    color: "bg-orange-500",
  },
  {
    id: 2,
    icon: RefreshCw,
    color: "bg-primary",
  },
  {
    id: 3,
    icon: CreditCard,
    color: "bg-primary",
  },
];

export function QuickSolutions({
  isArabic,
  title,
  items,
}: QuickSolutionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 h-full"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
        {title}
      </h3>

      <div className="space-y-4">
        {quickLinks.map((link, index) => {
          const item = items[index];
          const Icon = link.icon;
          return (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ x: isArabic ? -5 : 5 }}
              className="group"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                <motion.div
                  className={`flex-shrink-0 w-12 h-12 ${link.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm md:text-base mb-1 group-hover:text-primary transition-colors duration-300">
                    {item?.title}
                  </h4>
                  <p className="text-muted-foreground text-xs md:text-sm truncate">
                    {item?.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
