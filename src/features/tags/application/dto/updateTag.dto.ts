import { z } from "zod/v4";

export const UpdateTagDto = z.object({
  name: z.string().optional(),
  type: z.enum(["prompt_tag", "resource_tag"]).optional(),
  sync: z.boolean().optional(),
});

/** Tipos de entrada */
export type UpdateTagInput = z.infer<typeof UpdateTagDto>;
