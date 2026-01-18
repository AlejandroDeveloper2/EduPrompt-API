import { z } from "zod/v4";

/** Valida una contraseña  */
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;

export const RegisterDto = z.object({
  userName: z.string().min(3),
  email: z.email(),
  password: z.string().regex(passwordRegex),
});

/** Tipos de entrada */
export type RegisterInput = z.infer<typeof RegisterDto>;
