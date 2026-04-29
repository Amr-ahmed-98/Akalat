import { ChefHat } from "lucide-react";

import { cn } from "@/src/shared/lib/utils";

type BrandLogoProps = {
  className?: string;
  tone?: "default" | "light";
  locale?: "en" | "ar";
};

export function BrandLogo({
  className,
  tone = "default",
  locale = "en",
}: BrandLogoProps) {
  const primaryText = tone === "light" ? "text-white" : "text-secondary";
  const isArabic = locale === "ar";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid size-10 place-items-center rounded-full bg-primary text-white shadow-sm">
        <ChefHat className="size-5" />
      </span>

      <span className="text-2xl font-black tracking-tight">
        <span className={primaryText}>{isArabic ? "وجبه" : "wajba"}</span>
        <span className="text-primary">{isArabic ? " AI" : "Ai"}</span>
      </span>
    </div>
  );
}
