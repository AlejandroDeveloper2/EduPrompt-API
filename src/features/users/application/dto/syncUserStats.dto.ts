import { z } from "zod/v4";

import { UpdateUserPreferencesDto } from "./user.dto";

export const SyncUserStatsDto = z.object({
  tokenCoins: z.number().min(0).nonnegative(),
  isPremiumUser: z.boolean(),
  userPreferences: UpdateUserPreferencesDto,
});

export type SyncUserStatsInput = z.infer<typeof SyncUserStatsDto>;
