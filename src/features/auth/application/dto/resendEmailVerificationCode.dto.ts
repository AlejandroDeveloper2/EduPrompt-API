import { z } from "zod/v4";

/** Dto de entrada */
export const ResendEmailVerificationCodeDto = z.object({
  email: z.email(),
});

/** Tipos de entrada */
export type ResendEmailVerificationCodeInput = z.infer<
  typeof ResendEmailVerificationCodeDto
>;
