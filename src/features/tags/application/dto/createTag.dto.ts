import { z } from "zod/v4";

export const CreateTagDto = z.object({
  tagId: z.uuidv4(),
  name: z.string().min(3),
  type: z.enum(["prompt_tag", "resource_tag"]),
});

/** Tipos de entrada */
export type CreateTagInput = z.infer<typeof CreateTagDto>;
