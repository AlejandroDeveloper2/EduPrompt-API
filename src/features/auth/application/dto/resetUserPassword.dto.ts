import { z } from "zod/v4";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;

/** Dto de entrada */
export const ResetUserPasswordDto = z.object({
  newPassword: z.string().regex(passwordRegex),
});

/** Tipos de entrada */
export type ResetUserPasswordInput = z.infer<typeof ResetUserPasswordDto>;
