import { z } from "zod/v4";

export const DeleteManyTagsDto = z.object({
  tagIds: z.array(z.uuidv4()).min(1),
});

export type DeleteManyTagsInput = z.infer<typeof DeleteManyTagsDto>;
