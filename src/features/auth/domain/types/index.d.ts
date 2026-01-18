import { Session, VerificationCode } from "../entities";

type VerificationCodeType =
  | "email_verification"
  | "password_reset"
  | "email_reset";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  userName: string;
  email: string;
  password: string;
}

interface ChangeUserPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

type CreateSession = Omit<Session, "sessionId" | "createdAt">;
type CreateCode = Omit<VerificationCode, "codeId">;

export type {
  LoginPayload,
  SignupPayload,
  ChangeUserPasswordPayload,
  VerificationCodeType,
  CreateSession,
  CreateCode,
};
