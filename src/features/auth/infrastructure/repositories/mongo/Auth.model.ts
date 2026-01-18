import { model, Schema } from "mongoose";

import { VerificationCodeType } from "@/features/auth/domain/types";

export interface MongoSession {
  _id: string;
  sessionToken: string;
  refreshToken: string;
  active: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface MongoVerificationCode {
  _id: string;
  code: string;
  type: VerificationCodeType;
  userId: string;
  expiresAt: Date;
}

/** Esquema de sesión de usuario en mongo db */
const SessionSchema = new Schema<MongoSession>(
  {
    sessionToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

/** Esquema de código de verificación en mongo db */
const VerificationCodeSchema = new Schema<MongoVerificationCode>(
  {
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["email_verification", "password_reset", "email_reset"],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);
export const SessionModel = model("sessions", SessionSchema);
export const VerificationCodeModel = model(
  "verification_codes",
  VerificationCodeSchema
);
