import {
  getClientCookie,
  removeClientCookie,
  setClientCookie,
} from "@/src/shared/lib/cookies/client-cookies";
import type { AuthPayload, AuthTokens, PublicUser } from "./types";

const ACCESS_TOKEN_COOKIE_KEY = "akalat.access-token";
const DEFAULT_ACCESS_TOKEN_EXPIRY_IN_DAYS = 15 / (24 * 60);

let memoryRefreshToken: string | null = null;
let authenticatedUser: PublicUser | null = null;

function emitAuthChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("akalat:auth-session-changed"));
}

function durationToCookieDays(value: string | undefined): number {
  if (!value) {
    return DEFAULT_ACCESS_TOKEN_EXPIRY_IN_DAYS;
  }

  const match = /^(\d+)(ms|s|m|h|d)$/i.exec(value.trim());
  if (!match) {
    return DEFAULT_ACCESS_TOKEN_EXPIRY_IN_DAYS;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const milliseconds =
    unit === "ms"
      ? amount
      : unit === "s"
        ? amount * 1000
        : unit === "m"
          ? amount * 60 * 1000
          : unit === "h"
            ? amount * 60 * 60 * 1000
            : amount * 24 * 60 * 60 * 1000;

  return milliseconds / (24 * 60 * 60 * 1000);
}

export function getAccessToken(): string | undefined {
  return getClientCookie(ACCESS_TOKEN_COOKIE_KEY);
}

export function getRefreshToken(): string | null {
  return memoryRefreshToken;
}

export function hasRefreshToken(): boolean {
  return Boolean(memoryRefreshToken);
}

export function getAuthenticatedUser(): PublicUser | null {
  return authenticatedUser;
}

export function setAuthenticatedUser(user: PublicUser | null): void {
  authenticatedUser = user;
  emitAuthChange();
}

export function persistAuthTokens(tokens: AuthTokens): void {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";

  setClientCookie(ACCESS_TOKEN_COOKIE_KEY, tokens.accessToken, {
    expires: durationToCookieDays(tokens.accessTokenExpiresIn),
    secure,
  });

  memoryRefreshToken = tokens.refreshToken;
  emitAuthChange();
}

export function persistAuthPayload(payload: AuthPayload): void {
  persistAuthTokens(payload.tokens);
  setAuthenticatedUser(payload.user);
}

export function clearAuthSession(): void {
  removeClientCookie(ACCESS_TOKEN_COOKIE_KEY);
  memoryRefreshToken = null;
  authenticatedUser = null;
  emitAuthChange();
}
