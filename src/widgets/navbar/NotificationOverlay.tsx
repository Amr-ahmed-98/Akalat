"use client";

import { Clock3 } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread?: boolean;
};

type NotificationOverlayProps = {
  items: NotificationItem[];
  title?: string;
  className?: string;
};

export const NotificationOverlay = ({
  items,
  title = "Notifications",
  className,
}: NotificationOverlayProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-xl",
        className,
      )}
    >
      <h3 className="text-base font-bold text-foreground">{title}</h3>

      <div className="mt-3 max-h-88 space-y-2 overflow-y-auto pe-1">
        {items.length === 0 ? (
          <p className="rounded-xl bg-muted/60 px-3 py-3 text-sm text-muted-foreground">
            You have no notifications yet.
          </p>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-border bg-background px-3 py-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                {item.isUnread ? (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                ) : null}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>

              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="size-3.5" />
                {item.time}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
