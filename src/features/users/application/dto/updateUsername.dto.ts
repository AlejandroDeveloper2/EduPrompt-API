import { z } from "zod/v4";

/** Dto de entrada */
export const UpdateUsernameDto = z.object({
  userName: z.string().min(3),
});

/** Tipo de entrada */
export type UpdateUsernameInput = z.infer<typeof UpdateUsernameDto>;
