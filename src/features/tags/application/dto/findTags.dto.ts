import { z } from "zod/v4";

/** Dto de entrada */
export const TagFiltersDto = z.object({
  name: z.string().optional(),
  type: z.enum(["prompt_tag", "resource_tag"]),
  page: z
    .string()
    .optional()
    .refine((val) => !val || parseInt(val) >= 0),
  limit: z
    .string()
    .optional()
    .refine((val) => !val || parseInt(val) > 0),
});

/** Dto de salida */
export const TagOutputDto = z.object({
  tagId: z.uuidv4(),
  name: z.string().min(3),
  type: z.enum(["prompt_tag", "resource_tag"]),
  sync: z.boolean(),
});

/** Tipos de entrada */
export type TagFiltersInput = z.infer<typeof TagFiltersDto>;
export type TagOutput = z.infer<typeof TagOutputDto>;
