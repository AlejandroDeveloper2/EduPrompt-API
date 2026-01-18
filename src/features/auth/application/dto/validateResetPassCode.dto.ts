import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

/** Dto de entrada */
export const ValidateResetPassCodeDto = z.object({
  code: z.string().min(4).max(4),
});

/** Dto de salida */
export const ValidateResetPassCodeResponseDto = z.object({
  userId: objectIdSchema,
});

/** Tipo de entrada */
export type ValidateResetPassInput = z.infer<typeof ValidateResetPassCodeDto>;

/** Tipo de salida */
export type ValidateResetPassCodeOutput = z.infer<
  typeof ValidateResetPassCodeResponseDto
>;
