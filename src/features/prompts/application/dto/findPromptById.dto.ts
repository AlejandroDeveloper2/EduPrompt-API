import { z } from "zod/v4";

export const PromptIdParamDto = z.object({
  promptId: z.uuidv4(),
});
