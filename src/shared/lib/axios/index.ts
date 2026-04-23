import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthPayload,
} from "@/src/features/auth/model/auth-sessions";
import type { AuthPayload, SuccessEnvelope } from "@/src/features/auth/model/types";

declare module "axios" {
  // Axios 1.14 declares these merged interfaces with `D = any`,
  // so the augmentation has to match that exact signature.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  export interface AxiosRequestConfig<D = any> {
    skipAuthRefresh?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  export interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let activeRefreshRequest: Promise<AuthPayload | null> | null = null;

const NON_REFRESHABLE_ENDPOINTS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/google",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/logout-all",
  "/api/auth/verify-email",
  "/api/auth/send-otp",
  "/api/auth/verify-otp",
  "/api/auth/resend-otp",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

function isNonRefreshableEndpoint(url: string): boolean {
  return NON_REFRESHABLE_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function shouldAttemptRefresh(
  config?: InternalAxiosRequestConfig,
  error?: AxiosError,
): config is InternalAxiosRequestConfig {
  if (!config || config._retry || config.skipAuthRefresh) {
    return false;
  }

  if (error?.response?.status !== 401) {
    return false;
  }

  if (!getRefreshToken()) {
    return false;
  }

  if (!config.url || isNonRefreshableEndpoint(config.url)) {
    return false;
  }

  return true;
}

async function refreshAccessToken(): Promise<AuthPayload | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthSession();
    return null;
  }

  const refreshUrl = baseURL ? `${baseURL}/api/auth/refresh` : "/api/auth/refresh";

  try {
    const response = await axios.post<SuccessEnvelope<AuthPayload>>(
      refreshUrl,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    const payload = response.data.data;
    persistAuthPayload(payload);
    return payload;
  } catch {
    clearAuthSession();
    return null;
  }
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (!shouldAttemptRefresh(originalRequest, error)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!activeRefreshRequest) {
      activeRefreshRequest = refreshAccessToken().finally(() => {
        activeRefreshRequest = null;
      });
    }

    const refreshedPayload = await activeRefreshRequest;
    if (!refreshedPayload) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${refreshedPayload.tokens.accessToken}`;

    return api(originalRequest as AxiosRequestConfig);
  },
);
