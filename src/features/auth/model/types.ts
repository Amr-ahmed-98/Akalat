export type AuthProvider = "credentials" | "google";

export type HouseholdType = "single" | "couple" | "family";
export type CookingSkillLevel = "beginner" | "intermediate" | "professional";
export type PrimaryCookingGoal =
  | "save-time"
  | "healthy-eating"
  | "learn-skills"
  | "save-money";
export type DietaryPreference =
  | "keto"
  | "vegan"
  | "vegetarian"
  | "paleo"
  | "low-carb";
export type FavoriteCuisine = "arabic" | "asian" | "italian" | "french";
export type KitchenTool =
  | "oven"
  | "air-fryer"
  | "pressure-cooker"
  | "blender"
  | "hand-blender"
  | "pot"
  | "microwave"
  | "stand-mixer";

export type CookingProfileInput = {
  householdType: HouseholdType | null;
  cookingSkillLevel: CookingSkillLevel | null;
  primaryCookingGoal: PrimaryCookingGoal | null;
  dietaryPreferences: DietaryPreference[];
  favoriteCuisines: FavoriteCuisine[];
  allergies: string[];
  availableKitchenTools: KitchenTool[];
  otherKitchenTools: string[];
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  authProviders: AuthProvider[];
  isActive: boolean;
  isEmailVerified: boolean;
  cookingProfile: CookingProfileInput;
  profileCompleted: boolean;
  currentOnboardingStep: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
};

export type AuthPayload = {
  user: PublicUser;
  tokens: AuthTokens;
};

export type MessagePayload = {
  message: string;
};

export type RegisterPayload = {
  message: string;
  user: PublicUser;
  emailVerificationRequired: boolean;
  verificationEmailDelivery: "not_required" | "sent" | "skipped" | "failed";
  canResendVerification: boolean;
  verificationUrl?: string;
  verificationOtp?: string;
};

export type VerifyEmailPayload = {
  message: string;
  user: PublicUser;
};

export type OtpDispatchPayload = {
  message: string;
  verificationUrl?: string;
  verificationOtp?: string;
};

export type ForgotPasswordPayload = {
  message: string;
  resetToken?: string;
};

export type SuccessEnvelope<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ErrorEnvelope = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    path: string;
    method: string;
    requestId?: string;
  };
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cookingProfile?: Partial<CookingProfileInput>;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type GoogleLoginRequest = {
  idToken: string;
  name?: string;
  cookingProfile?: Partial<CookingProfileInput>;
  profileCompleted?: boolean;
  currentOnboardingStep?: number;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type VerifyEmailRequest = VerifyOtpRequest | { token: string };

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
