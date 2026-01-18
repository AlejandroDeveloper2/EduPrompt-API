import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";

import {
  CreateUser,
  UserPreferences,
  UserStats,
  AccountStatus,
} from "../types";

import { User } from "../entities";

export interface UserRepositoryType {
  create: (
    newUser: CreateUser,
    ctx?: TransactionContext
  ) => Promise<Pick<User, "userId">>;
  findById: (userId: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findByUsername: (userName: string) => Promise<User | null>;
  updateUsername: (
    userId: string,
    updatedUsername: string
  ) => Promise<void | null>;
  updateEmail: (userId: string, updatedEmail: string) => Promise<void | null>;
  updateAccountType: (
    userId: string,
    isPremiumUser: boolean
  ) => Promise<void | null>;
  updateAccountStatus: (
    userId: string,
    accountStatus: AccountStatus
  ) => Promise<void | null>;
  updateTokenCoins: (
    userId: string,
    tokenCoins: number
  ) => Promise<void | null>;
  updateUserPassword: (
    userId: string,
    newPassword: string
  ) => Promise<void | null>;
  updateUserPreferences: (
    userId: string,
    updatedPreferences: Partial<UserPreferences>
  ) => Promise<void>;
  updateUserStats: (
    userId: string,
    userStats: UserStats
  ) => Promise<void | null>;
}
