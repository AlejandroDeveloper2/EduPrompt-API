import { z } from "zod/v4";

const ResourceDto = z.object({
  resourceId: z.uuidv4(),
  title: z.string().min(1),
  content: z.string().min(1),
  format: z.string().min(1),
  formatKey: z.enum(["text", "table", "image", "chart"]),
  groupTag: z.string().min(1),
});

export const SyncResourcesDto = z.object({
  resources: z.array(ResourceDto).min(1),
});

export type SyncResourcesInput = z.infer<typeof SyncResourcesDto>;
