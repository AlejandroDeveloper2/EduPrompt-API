import { z } from "zod/v4";

export const TagIdParamDto = z.object({
  tagId: z.uuidv4(),
});
