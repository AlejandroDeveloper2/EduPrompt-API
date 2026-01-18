import { z } from "zod/v4";

export const UpdateResourceDto = z.object({
  title: z.string().min(1),
  groupTag: z.string().min(1),
});

export type UpdateResourceInput = z.infer<typeof UpdateResourceDto>;
