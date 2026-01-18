import { z } from "zod/v4";

/* DTOs de entrada (request)*/
export const CreatePromptDto = z.object({
  promptId: z.uuidv4(),
  promptTitle: z.string().min(1),
  promptText: z.string().min(1),
  tag: z.string().min(1),
});

/** Tipos de entrada */
export type CreatePromptInput = z.infer<typeof CreatePromptDto>;
