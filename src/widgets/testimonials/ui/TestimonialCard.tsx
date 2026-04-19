"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

import { cn } from "@/src/shared/lib/utils";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  image: string;
  delay: number;
  isArabic: boolean;
}

export function TestimonialCard({
  name,
  role,
  content,
  image,
  delay,
  isArabic,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="group relative h-full"
    >
      <div className="relative flex h-full flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-lg transition-all duration-500 hover:shadow-2xl md:rounded-3xl md:p-8">
        {/* Content */}
        <div className="flex h-full flex-col gap-6">
          {/* Quote Icon */}
          <div className={cn("flex", isArabic ? "justify-start" : "justify-end")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 md:h-12 md:w-12">
              <Quote className="h-5 w-5 text-primary md:h-6 md:w-6" />
            </div>
          </div>

          {/* Testimonial Text */}
          <p className="text-sm leading-relaxed text-foreground md:text-base">
            {content}
          </p>

          {/* Divider */}
          <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-accent" />

          {/* Author Info */}
          <div className="mt-auto flex items-center gap-4">
            {/* Avatar */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 md:h-14 md:w-14">
                <Image
                  src={image}
                  alt={name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <motion.div
                className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Name & Role */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground text-base md:text-lg truncate group-hover:text-primary transition-colors duration-300">
                {name}
              </h4>
              <p className="text-muted-foreground text-sm truncate">{role}</p>
            </div>
          </div>
        </div>

        {/* Hover gradient effect */}
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </div>
    </motion.div>
  );
}
