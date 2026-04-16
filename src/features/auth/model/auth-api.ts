import { isAxiosError } from "axios";
import { api } from "@/src/shared/lib/axios";
import { clearAuthSession, getRefreshToken, persistAuthPayload, setAuthenticatedUser } from "./auth-sessions";
import { disableGoogleAutoSelect } from "./google";
import type {
  AuthPayload,
  ChangePasswordRequest,
  ErrorEnvelope,
  ForgotPasswordPayload,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  MessagePayload,
  OtpDispatchPayload,
  PublicUser,
  RegisterPayload,
  RegisterRequest,
  ResetPasswordRequest,
  SuccessEnvelope,
  VerifyEmailPayload,
  VerifyEmailRequest,
  VerifyOtpRequest,
} from "./types";

function unwrapResponse<T>(response: { data: SuccessEnvelope<T> }): T {
  return response.data.data;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong.",
): string {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as ErrorEnvelope | undefined;
    return responseData?.error?.message ?? error.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterPayload> {
  const response = await api.post<SuccessEnvelope<RegisterPayload>>(
    "/api/auth/register",
    payload,
    { skipAuthRefresh: true },
  );

  return unwrapResponse(response);
}

export async function loginUser(payload: LoginRequest): Promise<AuthPayload> {
  const response = await api.post<SuccessEnvelope<AuthPayload>>(
    "/api/auth/login",
    payload,
    { skipAuthRefresh: true },
  );

  const data = unwrapResponse(response);
  persistAuthPayload(data);
  return data;
}

export async function authenticateWithGoogle(
  payload: GoogleLoginRequest,
): Promise<AuthPayload> {
  const response = await api.post<SuccessEnvelope<AuthPayload>>(
    "/api/auth/google",
    payload,
    { skipAuthRefresh: true },
  );

  const data = unwrapResponse(response);
  persistAuthPayload(data);
  return data;
}

export async function fetchCurrentUser(): Promise<PublicUser> {
  const response = await api.get<SuccessEnvelope<PublicUser>>("/api/auth/me");
  const user = unwrapResponse(response);
  setAuthenticatedUser(user);
  return user;
}

export async function logoutUser(): Promise<void> {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await api.post<SuccessEnvelope<MessagePayload>>(
        "/api/auth/logout",
        { refreshToken },
        { skipAuthRefresh: true },
      );
    }
  } finally {
    disableGoogleAutoSelect();
    clearAuthSession();
  }
}

export async function logoutEverywhere(): Promise<void> {
  try {
    await api.post<SuccessEnvelope<MessagePayload>>(
      "/api/auth/logout-all",
      undefined,
      { skipAuthRefresh: false },
    );
  } finally {
    disableGoogleAutoSelect();
    clearAuthSession();
  }
}

export async function verifyEmail(
  payload: VerifyEmailRequest,
): Promise<VerifyEmailPayload> {
  const response = await api.post<SuccessEnvelope<VerifyEmailPayload>>(
    "/api/auth/verify-email",
    payload,
    { skipAuthRefresh: true },
  );

  return unwrapResponse(response);
}

export async function sendOtp(email: string): Promise<OtpDispatchPayload> {
  const response = await api.post<SuccessEnvelope<OtpDispatchPayload>>(
    "/api/auth/send-otp",
    { email },
    { skipAuthRefresh: true },
  );

  return unwrapResponse(response);
}

export async function verifyOtp(
  payload: VerifyOtpRequest,
): Promise<VerifyEmailPayload> {
  const response = await api.post<SuccessEnvelope<VerifyEmailPayload>>(
    "/api/auth/verify-otp",
    payload,
    { skipAuthRefresh: true },
  );

  return unwrapResponse(response);
}

export async function resendOtp(email: string): Promise<OtpDispatchPayload> {
  const response = await api.post<SuccessEnvelope<OtpDispatchPayload>>(
    "/api/auth/resend-otp",
    { email },
    { skipAuthRefresh: true },
  );

  return unwrapResponse(response);
}

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordPayload> {
  const response = await api.post<SuccessEnvelope<ForgotPasswordPayload>>(
    "/api/auth/forgot-password",
    payload,
    { skipAuthRefresh: true },
  );

  return unwrapResponse(response);
}

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<MessagePayload> {
  const response = await api.post<SuccessEnvelope<MessagePayload>>(
    "/api/auth/reset-password",
    payload,
    { skipAuthRefresh: true },
  );

  return unwrapResponse(response);
}

export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<MessagePayload> {
  const response = await api.post<SuccessEnvelope<MessagePayload>>(
    "/api/auth/change-password",
    payload,
  );

  return unwrapResponse(response);
}
