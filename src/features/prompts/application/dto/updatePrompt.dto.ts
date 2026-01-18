import { z } from "zod/v4";

export const UpdatePromptDto = z.object({
  promptTitle: z.string().min(1),
  promptText: z.string().min(1),
  tag: z.string().min(1),
});

export type UpdatePromptInput = z.infer<typeof UpdatePromptDto>;
