import { Session, VerificationCode } from "../entities";

import { CreateCode, CreateSession, VerificationCodeType } from "../types";

export interface AuthRepositoryType {
  createCode(newCode: CreateCode): Promise<void>;
  findByCode(
    code: string,
    type: VerificationCodeType
  ): Promise<VerificationCode | null>;
  deleteCodesByUserId(userId: string): Promise<void>;

  findSessionByToken(sessionToken: string): Promise<Session | null>;
  findSessionByRefreshToken: (refreshToken: string) => Promise<Session | null>;
  createSession: (newSession: CreateSession) => Promise<void>;
  updateSessionToken: (
    sessionId: string,
    updatedSession: Pick<Session, "refreshToken" | "sessionToken" | "expiresAt">
  ) => Promise<void>;
  invalidateSession: (sessionId: string) => Promise<void>;

  countCodesByUser: (
    userId: string,
    type: VerificationCodeType
  ) => Promise<number>;
  deleteCodesByType: (
    userId: string,
    type: VerificationCodeType
  ) => Promise<void>;
}
