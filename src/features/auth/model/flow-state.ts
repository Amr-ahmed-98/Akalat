import type { AuthProvider } from "./types";

export type RegisterStep = 1 | 2 | 3;
export type OtpFlowMode = "verify-email" | "forgot-password";

export type RegisterFlowState = {
  provider: AuthProvider;
  currentStep: RegisterStep;
  maxReachedStep: RegisterStep;
  googleIdToken?: string;
  googleName?: string;
  googleEmail?: string;
  updatedAt: number;
};

export type OtpFlowState = {
  mode: OtpFlowMode;
  email: string;
  resetToken?: string;
  verificationOtp?: string;
  verificationUrl?: string;
  updatedAt: number;
};

export type PasswordResetFlowState = {
  email: string;
  resetToken?: string;
  otpVerified: boolean;
  updatedAt: number;
};

const REGISTER_FLOW_KEY = "akalat.auth.register-flow";
const OTP_FLOW_KEY = "akalat.auth.otp-flow";
const PASSWORD_RESET_FLOW_KEY = "akalat.auth.password-reset-flow";

const REGISTER_FLOW_TTL = 24 * 60 * 60 * 1000;
const OTP_FLOW_TTL = 30 * 60 * 1000;
const PASSWORD_RESET_FLOW_TTL = 30 * 60 * 1000;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function readState<T extends { updatedAt: number }>(
  key: string,
  ttl: number,
): T | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(key);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as T;
    if (!parsedValue.updatedAt || Date.now() - parsedValue.updatedAt > ttl) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    return parsedValue;
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

function writeState<T extends { updatedAt: number }>(key: string, value: T): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(
    key,
    JSON.stringify({
      ...value,
      updatedAt: Date.now(),
    }),
  );
}

function removeState(key: string): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(key);
}

export function createInitialRegisterFlow(
  provider: AuthProvider = "credentials",
): RegisterFlowState {
  return {
    provider,
    currentStep: 1,
    maxReachedStep: 1,
    updatedAt: Date.now(),
  };
}

export function getRegisterFlowState(): RegisterFlowState | null {
  return readState<RegisterFlowState>(REGISTER_FLOW_KEY, REGISTER_FLOW_TTL);
}

export function writeRegisterFlowState(state: RegisterFlowState): void {
  writeState(REGISTER_FLOW_KEY, state);
}

export function ensureRegisterFlowState(
  provider: AuthProvider = "credentials",
): RegisterFlowState {
  const existingState = getRegisterFlowState();
  if (existingState) {
    return existingState;
  }

  const nextState = createInitialRegisterFlow(provider);
  writeRegisterFlowState(nextState);
  return nextState;
}

export function resetRegisterFlowToCredentials(): RegisterFlowState {
  const nextState = createInitialRegisterFlow("credentials");
  writeRegisterFlowState(nextState);
  return nextState;
}

export function setRegisterFlowStep(step: RegisterStep): RegisterFlowState {
  const currentState = ensureRegisterFlowState();
  const nextState: RegisterFlowState = {
    ...currentState,
    currentStep: step,
    maxReachedStep: Math.max(currentState.maxReachedStep, step) as RegisterStep,
    updatedAt: Date.now(),
  };

  writeRegisterFlowState(nextState);
  return nextState;
}

export function beginGoogleRegisterFlow(input: {
  googleIdToken: string;
  googleName?: string;
  googleEmail?: string;
  step?: RegisterStep;
}): RegisterFlowState {
  const nextStep = input.step ?? 2;
  const nextState: RegisterFlowState = {
    provider: "google",
    currentStep: nextStep,
    maxReachedStep: nextStep,
    googleIdToken: input.googleIdToken,
    googleName: input.googleName,
    googleEmail: input.googleEmail,
    updatedAt: Date.now(),
  };

  writeRegisterFlowState(nextState);
  return nextState;
}

export function clearRegisterFlowState(): void {
  removeState(REGISTER_FLOW_KEY);
}

export function beginEmailVerificationFlow(input: {
  email: string;
  verificationOtp?: string;
  verificationUrl?: string;
}): OtpFlowState {
  const nextState: OtpFlowState = {
    mode: "verify-email",
    email: input.email,
    verificationOtp: input.verificationOtp,
    verificationUrl: input.verificationUrl,
    updatedAt: Date.now(),
  };

  writeState(OTP_FLOW_KEY, nextState);
  return nextState;
}

export function beginForgotPasswordFlow(input: {
  email: string;
  resetToken?: string;
  verificationOtp?: string;
  verificationUrl?: string;
}): {
  otpFlow: OtpFlowState;
  passwordResetFlow: PasswordResetFlowState;
} {
  const otpFlow: OtpFlowState = {
    mode: "forgot-password",
    email: input.email,
    resetToken: input.resetToken,
    verificationOtp: input.verificationOtp,
    verificationUrl: input.verificationUrl,
    updatedAt: Date.now(),
  };

  const passwordResetFlow: PasswordResetFlowState = {
    email: input.email,
    resetToken: input.resetToken,
    otpVerified: false,
    updatedAt: Date.now(),
  };

  writeState(OTP_FLOW_KEY, otpFlow);
  writeState(PASSWORD_RESET_FLOW_KEY, passwordResetFlow);

  return {
    otpFlow,
    passwordResetFlow,
  };
}

export function getOtpFlowState(): OtpFlowState | null {
  return readState<OtpFlowState>(OTP_FLOW_KEY, OTP_FLOW_TTL);
}

export function clearOtpFlowState(): void {
  removeState(OTP_FLOW_KEY);
}

export function getPasswordResetFlowState(): PasswordResetFlowState | null {
  return readState<PasswordResetFlowState>(
    PASSWORD_RESET_FLOW_KEY,
    PASSWORD_RESET_FLOW_TTL,
  );
}

export function setPasswordResetFlowState(
  state: PasswordResetFlowState,
): PasswordResetFlowState {
  writeState(PASSWORD_RESET_FLOW_KEY, state);
  return state;
}

export function markForgotPasswordOtpVerified(): PasswordResetFlowState | null {
  const currentState = getPasswordResetFlowState();
  if (!currentState) {
    return null;
  }

  const nextState: PasswordResetFlowState = {
    ...currentState,
    otpVerified: true,
    updatedAt: Date.now(),
  };

  writeState(PASSWORD_RESET_FLOW_KEY, nextState);
  return nextState;
}

export function setPasswordResetToken(token: string): PasswordResetFlowState {
  const currentState = getPasswordResetFlowState();
  const nextState: PasswordResetFlowState = {
    email: currentState?.email ?? "",
    resetToken: token,
    otpVerified: currentState?.otpVerified ?? false,
    updatedAt: Date.now(),
  };

  writeState(PASSWORD_RESET_FLOW_KEY, nextState);
  return nextState;
}

export function clearPasswordResetFlowState(): void {
  removeState(PASSWORD_RESET_FLOW_KEY);
}

export function mapBackendOnboardingStepToRegisterStep(
  currentOnboardingStep?: number | null,
): RegisterStep {
  if (currentOnboardingStep === 2 || (currentOnboardingStep ?? 0) > 2) {
    return 3;
  }

  return 2;
}
