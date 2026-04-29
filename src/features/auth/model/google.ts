export type GoogleCredentialResponse = {
  credential: string;
  select_by: string;
  clientId?: string;
};

export type DecodedGoogleProfile = {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub?: string;
};

type GoogleCredentialHandler =
  | ((response: GoogleCredentialResponse) => void | Promise<void>)
  | null;

type GoogleInitializeConfig = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  locale?: string;
  ux_mode?: "popup" | "redirect";
  cancel_on_tap_outside?: boolean;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
    __wajbaAiGoogleInitialized?: boolean;
  }
}

const GOOGLE_SCRIPT_ID = "wajbaAi-google-identity-script";
let googleScriptPromise: Promise<void> | null = null;
let activeGoogleCredentialHandler: GoogleCredentialHandler = null;

export function getGoogleClientId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";
}

export function setGoogleCredentialHandler(handler: GoogleCredentialHandler): void {
  activeGoogleCredentialHandler = handler;
}

export async function loadGoogleIdentityScript(locale?: string): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (window.google?.accounts?.id) {
    return;
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const scriptElement = document.createElement("script");
    const localeSuffix = locale ? `?hl=${encodeURIComponent(locale)}` : "";

    scriptElement.id = GOOGLE_SCRIPT_ID;
    scriptElement.src = `https://accounts.google.com/gsi/client${localeSuffix}`;
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.onload = () => resolve();
    scriptElement.onerror = () =>
      reject(new Error("Failed to load Google Identity Services."));

    document.head.appendChild(scriptElement);
  });

  return googleScriptPromise;
}

export function initializeGoogleIdentity(options?: { locale?: string }): void {
  if (typeof window === "undefined" || !window.google?.accounts?.id) {
    return;
  }

  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
  }

  if (window.__wajbaAiGoogleInitialized) {
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      void activeGoogleCredentialHandler?.(response);
    },
    locale: options?.locale,
    ux_mode: "popup",
    cancel_on_tap_outside: true,
  });

  window.__wajbaAiGoogleInitialized = true;
}

export function renderGoogleIdentityButton(input: {
  container: HTMLElement;
  locale?: string;
  mode: "login" | "register";
}): void {
  if (typeof window === "undefined" || !window.google?.accounts?.id) {
    return;
  }

  input.container.innerHTML = "";

  window.google.accounts.id.renderButton(input.container, {
    type: "standard",
    theme: "outline",
    size: "large",
    shape: "pill",
    text: input.mode === "register" ? "signup_with" : "signin_with",
    locale: input.locale,
    width: Math.max(input.container.clientWidth, 280),
  });
}

export function decodeGoogleCredentialPayload(
  credential: string,
): DecodedGoogleProfile | null {
  try {
    const payloadSegment = credential.split(".")[1];
    if (!payloadSegment) {
      return null;
    }

    const normalizedPayload = payloadSegment
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadSegment.length / 4) * 4, "=");

    const jsonPayload = atob(normalizedPayload);
    return JSON.parse(jsonPayload) as DecodedGoogleProfile;
  } catch {
    return null;
  }
}

export function disableGoogleAutoSelect(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.google?.accounts?.id?.disableAutoSelect?.();
}

