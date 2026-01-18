import { z } from "zod/v4";

export const DeletePromptsByIdDto = z.object({
  promptIds: z.array(z.uuidv4()).min(1),
});

export type DeletePromptsByIdInput = z.infer<typeof DeletePromptsByIdDto>;
