import { z } from "zod/v4";

/** Dto de entrada */
export const UpdateUserPreferencesDto = z.object({
  autoSync: z.boolean().optional(),
  cleanFrecuency: z.string().optional().nullable(),
  pushNotifications: z.boolean().optional(),
  autoCleanNotifications: z.boolean().optional(),
  language: z.string().optional(),
  lastCleanAt: z.string().optional(),
});

/* DTO de salida (response)*/
export const UserResponseDto = z.object({
  userName: z.string().min(3),
  email: z.email(),
  tokenCoins: z.number().min(0).nonnegative(),
  isPremiumUser: z.boolean(),
  userPreferences: UpdateUserPreferencesDto.optional(),
});

/** Tipos de entrada */
export type UserPreferencesInput = z.infer<typeof UpdateUserPreferencesDto>;

/** Tipos de salida */
export type UserOutput = z.infer<typeof UserResponseDto>;
