"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/shared/lib/utils";
import {
  decodeGoogleCredentialPayload,
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  renderGoogleIdentityButton,
  setGoogleCredentialHandler,
  type DecodedGoogleProfile,
  type GoogleCredentialResponse,
} from "../model/google";

type GoogleAuthButtonProps = {
  mode: "login" | "register";
  locale: string;
  onCredential: (
    response: GoogleCredentialResponse,
    profile: DecodedGoogleProfile | null,
  ) => void | Promise<void>;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "legacy";
  label?: string;
};

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 10.023H12.2v3.955h5.502c-.237 1.273-.95 2.35-2.02 3.072v2.55h3.273c1.916-1.764 3.018-4.359 3.018-7.434 0-.711-.061-1.394-.168-2.143Z"
        fill="#4285F4"
      />
      <path
        d="M12.2 22c2.75 0 5.055-.91 6.74-2.4l-3.273-2.55c-.91.61-2.074.978-3.467.978-2.643 0-4.885-1.786-5.683-4.185H3.138v2.63A10.18 10.18 0 0 0 12.2 22Z"
        fill="#34A853"
      />
      <path
        d="M6.517 13.842A6.104 6.104 0 0 1 6.199 12c0-.64.115-1.258.318-1.842v-2.63H3.138A10.18 10.18 0 0 0 2 12c0 1.64.392 3.192 1.138 4.472l3.379-2.63Z"
        fill="#FBBC04"
      />
      <path
        d="M12.2 5.973c1.497 0 2.841.515 3.898 1.526l2.918-2.918C17.248 2.928 14.943 2 12.2 2A10.18 10.18 0 0 0 3.138 7.528l3.379 2.63C7.315 7.759 9.557 5.973 12.2 5.973Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  mode,
  locale,
  onCredential,
  className,
  disabled = false,
  variant = "default",
  label,
}: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onCredential);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const missingClientIdError = clientId
    ? ""
    : "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID.";
  const [isReady, setIsReady] = useState(false);
  const [runtimeError, setRuntimeError] = useState("");

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let isMounted = true;

    if (!clientId) {
      return;
    }

    setGoogleCredentialHandler(async (response) => {
      if (!isMounted || disabled) {
        return;
      }

      const profile = decodeGoogleCredentialPayload(response.credential);
      await callbackRef.current(response, profile);
    });

    const setupGoogleButton = async () => {
      try {
        await loadGoogleIdentityScript(locale);
        initializeGoogleIdentity({ locale });

        if (!isMounted || !containerRef.current) {
          return;
        }

        renderGoogleIdentityButton({
          container: containerRef.current,
          locale,
          mode,
        });

        setRuntimeError("");
        setIsReady(true);
      } catch (setupError) {
        if (!isMounted) {
          return;
        }

        setIsReady(false);
        setRuntimeError(
          setupError instanceof Error
            ? setupError.message
            : "Google button could not be loaded.",
        );
      }
    };

    void setupGoogleButton();

    return () => {
      isMounted = false;
      setGoogleCredentialHandler(null);
    };
  }, [clientId, disabled, locale, mode]);

  const labelText = label ?? "Continue with Google";
  const error = missingClientIdError || runtimeError;

  return (
    <div
      className={cn(
        "space-y-2",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {variant === "legacy" ? (
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-colors"
          >
            <GoogleMark className="size-4 shrink-0" />
            <span>{labelText}</span>
          </div>
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden rounded-full opacity-0 [&_div]:!h-full [&_div]:!w-full"
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex min-h-11 items-center justify-center overflow-hidden rounded-full [&_div]:w-full"
        />
      )}
      {!isReady && !error ? (
        <p className="text-center text-xs text-muted-foreground">
          Loading Google...
        </p>
      ) : null}
      {error ? (
        <p className="text-center text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
