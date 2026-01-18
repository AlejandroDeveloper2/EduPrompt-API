import { model, Schema } from "mongoose";

import { AccountStatus, UserPreferences } from "../../../domain/types";

export interface MongoUser {
  _id: string;
  userName: string;
  email: string;
  password: string;
  tokenCoins: number;
  isPremiumUser: boolean;
  accountStatus: AccountStatus;
  userPreferences: UserPreferences;
}

/** Sub esquema de preferencias de usuario */
const UserPreferencesSchema = new Schema<UserPreferences>(
  {
    autoSync: {
      type: Boolean,
      default: false,
    },
    cleanFrecuency: {
      type: String,
      default: null,
    },
    pushNotifications: {
      type: Boolean,
      default: false,
    },
    autoCleanNotifications: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: "es",
    },
    lastCleanAt: {
      type: String,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    _id: false,
  }
);

/** Esquema de usuarios en mongo db */
const UserSchema = new Schema<MongoUser>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokenCoins: {
      type: Number,
      default: 0,
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    userPreferences: {
      type: UserPreferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const UserModel = model("users", UserSchema);
