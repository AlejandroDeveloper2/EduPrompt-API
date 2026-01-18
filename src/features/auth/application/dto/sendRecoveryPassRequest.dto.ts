import { z } from "zod/v4";

/** Dto de entrada */
export const RecoveryPasswordRequestDto = z.object({
  email: z.email(),
});

/** Tipo de entrada */
export type RecoveryPasswordRequestInput = z.infer<
  typeof RecoveryPasswordRequestDto
>;
