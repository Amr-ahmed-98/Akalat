import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/src/shared/lib/utils";

type AuthOptionCardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  active: boolean;
  onClick: () => void;
  className?: string;
};

export function AuthOptionCard({
  icon: Icon,
  title,
  description,
  active,
  onClick,
  className,
}: AuthOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-h-[112px] flex-col justify-between rounded-[24px] border p-3.5 text-start transition-all sm:min-h-[118px] sm:p-4",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[0_16px_38px_rgba(251,90,42,0.24)]"
          : "border-border bg-card text-foreground hover:border-primary/35 hover:shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-[18px] sm:size-11",
            active
              ? "bg-white/18 text-primary-foreground"
              : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4 sm:size-5" />
        </span>

        <span
          className={cn(
            "grid size-5 place-items-center rounded-full border text-[10px] sm:size-6",
            active
              ? "border-white/30 bg-white/15 text-white"
              : "border-border bg-background text-transparent",
          )}
        >
          <Check className="size-3.5" />
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-bold leading-5 sm:text-[0.95rem] sm:leading-6">
          {title}
        </p>

        {description ? (
          <p
            className={cn(
              "text-[11px] leading-4 sm:text-xs sm:leading-5",
              active ? "text-primary-foreground/82" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </button>
  );
}
