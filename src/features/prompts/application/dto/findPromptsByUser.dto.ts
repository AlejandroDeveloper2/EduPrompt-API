import { z } from "zod/v4";

/** Dto de entrada */
export const PromptsFiltersDto = z.object({
  title: z.string().optional(),
  tag: z.string().optional(),
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
export const PromptOutputDto = z.object({
  promptId: z.uuidv4(),
  promptTitle: z.string().min(1),
  promptText: z.string().min(1),
  tag: z.string().min(1),
});

/** Tipos de entrada */
export type PromptsFiltersInput = z.infer<typeof PromptsFiltersDto>;
export type PromptOutput = z.infer<typeof PromptOutputDto>;
