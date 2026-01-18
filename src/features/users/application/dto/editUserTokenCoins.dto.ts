import { z } from "zod/v4";

export const EditUserTokenCoinsDto = z.object({
  tokenCoins: z.number().min(0).nonnegative(),
});

export type EditUserTokenCoinsInput = z.infer<typeof EditUserTokenCoinsDto>;
