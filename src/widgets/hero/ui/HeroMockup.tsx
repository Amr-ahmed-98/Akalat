"use client";

import Image from "next/image";
import { motion, type Transition } from "motion/react";
import { Camera, Flame, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeUpEase: NonNullable<Transition["ease"]> = [0.22, 1, 0.36, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: fadeUpEase, delay },
});

const float = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, ease: "easeInOut" as const, repeat: Infinity },
  },
};

export function HeroMockup() {
  const t = useTranslations("HeroSection.mockup");

  return (
    <motion.div
      className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-[34rem]"
      {...float}
    >
      <div className="relative min-h-[26rem] sm:min-h-[29rem] lg:min-h-[31rem]">
        <motion.div
          {...fadeUp(0.15)}
          className="absolute left-0 top-0 z-30 w-[72%] rounded-[1.75rem] border border-slate-200/80 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:w-[58%] sm:px-5 sm:py-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-10 sm:w-10">
              <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground sm:text-[15px]">
                {t("scannerTitle")}
              </p>

              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border/80">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground sm:text-xs">
            {(
              [t("ingredient1"), t("ingredient2"), t("ingredient3")] as string[]
            ).map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.24)}
          className="absolute bottom-[4.8rem] left-0 z-10 h-[13.5rem] w-[70%] overflow-hidden rounded-[2rem] border-[10px] border-white bg-white shadow-[0_24px_50px_rgba(15,23,42,0.16)] sm:bottom-[5.4rem] sm:h-[15rem] sm:w-[45%] lg:h-[16rem]"
        >
          <Image
            src={"/images/landing/tomato-main.png"}
            alt=""
            fill
            quality={75}
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 220px, 180px"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          {...fadeUp(0.33)}
          className="absolute right-0 top-10 z-20 w-[60%] overflow-hidden rounded-[1.75rem] border-[10px] border-white bg-white shadow-[0_22px_48px_rgba(15,23,42,0.14)] sm:top-9 sm:w-[48%]"
        >
          <div className="relative h-36 w-full sm:h-40">
            <Image
              src={"/images/landing/salad-main.png"}
              alt=""
              fill
              quality={75}
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 200px"
              className="object-cover"
            />
          </div>

          <div className="px-4 pb-4 pt-3">
            <div className="flex items-center justify-between gap-2 text-[11px] font-bold sm:text-xs">
              <span className="inline-flex items-center gap-1 text-primary">
                <Flame className="h-3.5 w-3.5 shrink-0" />
                {t("matchBadge")}
              </span>
              <span className="text-muted-foreground">{t("recipeTime")}</span>
            </div>
            <p className="mt-2 text-sm font-black text-foreground sm:text-base">
              {t("recipeTitle")}
            </p>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.42)}
          className="absolute bottom-0 right-0 z-30 w-[62%] rounded-[1.6rem] border border-slate-200/80 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:w-[49%] sm:px-5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary sm:h-11 sm:w-11">
              <Heart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                {t("healthLabel")}
              </p>
              <p className="mt-0.5 text-sm font-bold leading-5 text-foreground sm:text-[15px]">
                {t("healthText")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
