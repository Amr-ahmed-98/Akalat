import { Button } from "@/src/shared/ui/button";
import { cn } from "@/src/shared/lib/utils";

type GoogleAuthButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export function GoogleAuthButton({
  label,
  onClick,
  className,
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-14 w-full rounded-full border-border bg-card text-base font-semibold text-foreground shadow-sm hover:bg-muted/40",
        className,
      )}
    >
      <GoogleMark className="size-5 shrink-0" />
      <span>{label}</span>
    </Button>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-.8 2.4-1.7 3.2l2.8 2.2c1.6-1.5 2.5-3.8 2.5-6.5 0-.6-.1-1.1-.2-1.7H12z"
      />
      <path
        fill="#34A853"
        d="M12 21c2.4 0 4.4-.8 5.9-2.1l-2.8-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.5-1.7-5.2-4H3.9v2.3A9 9 0 0 0 12 21z"
      />
      <path
        fill="#4A90E2"
        d="M6.8 13.6A5.5 5.5 0 0 1 6.5 12c0-.6.1-1.1.3-1.6V8.1H3.9A9 9 0 0 0 3 12c0 1.4.3 2.7.9 3.9l2.9-2.3z"
      />
      <path
        fill="#FBBC05"
        d="M12 6.4c1.3 0 2.5.5 3.4 1.3l2.5-2.5C16.4 3.8 14.4 3 12 3A9 9 0 0 0 3.9 8.1l2.9 2.3c.7-2.3 2.8-4 5.2-4z"
      />
    </svg>
  );
}
