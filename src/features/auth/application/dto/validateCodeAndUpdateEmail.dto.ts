import { z } from "zod/v4";

/** Dto de entrada */
export const ValidateCodeAndUpdateEmailDto = z.object({
  code: z.string().min(4).max(4),
  updatedEmail: z.email(),
});

/** Tipo de salida */
export type ValidateCodeAndUpdateEmailInput = z.infer<
  typeof ValidateCodeAndUpdateEmailDto
>;
