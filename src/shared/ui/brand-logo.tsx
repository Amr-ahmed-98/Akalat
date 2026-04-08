import { ChefHat } from "lucide-react";

import { cn } from "@/src/shared/lib/utils";

type BrandLogoProps = {
  className?: string;
  tone?: "default" | "light";
};

export function BrandLogo({ className, tone = "default" }: BrandLogoProps) {
  const primaryText = tone === "light" ? "text-white" : "text-secondary";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid size-10 place-items-center rounded-full bg-primary text-white shadow-sm">
        <ChefHat className="size-5" />
      </span>

      <span className="text-2xl font-black tracking-tight">
        <span className={primaryText}>أك</span>
        <span className="text-primary">لات</span>
      </span>
    </div>
  );
}
