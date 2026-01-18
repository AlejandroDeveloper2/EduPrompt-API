import { z } from "zod/v4";

const TagDto = z.object({
  tagId: z.uuidv4(),
  name: z.string().min(3),
  type: z.enum(["prompt_tag", "resource_tag"]),
  sync: z.boolean(),
});

export const SyncTagsDto = z.object({
  tags: z.array(TagDto).min(1),
});

export type SyncTagsInput = z.infer<typeof SyncTagsDto>;
