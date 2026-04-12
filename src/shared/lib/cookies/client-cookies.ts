import Cookies from "js-cookie";

export type ClientCookieOptions = Cookies.CookieAttributes;

const DEFAULT_COOKIE_OPTIONS: ClientCookieOptions = {
  path: "/",
  sameSite: "lax",
};

export function getClientCookie(name: string): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return Cookies.get(name);
}

export function setClientCookie(
  name: string,
  value: string,
  options?: ClientCookieOptions,
): void {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.set(name, value, {
    ...DEFAULT_COOKIE_OPTIONS,
    ...options,
  });
}

export function removeClientCookie(
  name: string,
  options?: ClientCookieOptions,
): void {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.remove(name, {
    ...DEFAULT_COOKIE_OPTIONS,
    ...options,
  });
}