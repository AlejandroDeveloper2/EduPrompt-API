import { z } from "zod/v4";

/** Dto de entrada */
export const LoginDto = z.object({
  email: z.email(),
  password: z.string().min(1),
});

/* Dto de salida (response) */
export const LoginResponseDto = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
});

/* Tipos de entrada **/
export type LoginInput = z.infer<typeof LoginDto>;

/** Tipos de salida **/
export type LoginOutput = z.infer<typeof LoginResponseDto>;
