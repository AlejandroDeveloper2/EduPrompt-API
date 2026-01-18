import { z } from "zod/v4";

/** Dto de entrada */
export const EditUserAccountTypeDto = z.object({
  isPremiumUser: z.boolean(),
});

/**Tipo de entrada */
export type EditUserAccountTypeInput = z.infer<typeof EditUserAccountTypeDto>;
