import { z } from "zod/v4";

export const PromptDto = z.object({
  promptId: z.uuidv4(),
  promptTitle: z.string().min(1),
  promptText: z.string().min(1),
  tag: z.string().min(1),
});

export const SyncPromptsDto = z.object({
  prompts: z.array(PromptDto).min(1),
});

export type SyncPromptsInput = z.infer<typeof SyncPromptsDto>;
