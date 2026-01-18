import { User } from "../entities";

type AccountStatus = "active" | "inactive";

interface UserPreferences {
  autoSync?: boolean | undefined;
  cleanFrecuency?: string | null | undefined;
  pushNotifications?: boolean | undefined;
  autoCleanNotifications?: boolean | undefined;
  language?: string | undefined;
  lastCleanAt?: string | undefined;
}

type CreateUser = Pick<User, "userName" | "email" | "password">;
type UserStats = Pick<User, "tokenCoins" | "isPremiumUser" | "userPreferences">;

export type { UserPreferences, AccountStatus, CreateUser, UserStats };
