import { z } from "zod/v4";

/** Valida una contraseña  */
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;

/** Dto de entrada */
export const ChangeUserPasswordDto = z.object({
  newPassword: z.string().regex(passwordRegex),
  currentPassword: z.string().min(1),
});

export type ChangeUserPasswordInput = z.infer<typeof ChangeUserPasswordDto>;
