import { z } from "zod/v4";

export const ValidateEmailVerificationCodeDto = z.object({
  code: z.string().min(4).max(4),
});

export type ValidateEmailVerificationInput = z.infer<
  typeof ValidateEmailVerificationCodeDto
>;
