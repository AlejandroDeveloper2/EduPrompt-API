import { z } from "zod/v4";

/** Dto de entrada */
export const ResourcesFiltersDto = z.object({
  title: z.string().optional(),
  tag: z.string().optional(),
  formatKey: z.enum(["text", "table", "image", "chart"]).optional(),
  page: z
    .string()
    .optional()
    .refine((val) => !val || parseInt(val) >= 0),
  limit: z
    .string()
    .optional()
    .refine((val) => !val || parseInt(val) > 0),
});

/* DTOs de salida (response)*/
export const EducationalResourceOutputDto = z.object({
  resourceId: z.uuidv4(),
  title: z.string().min(1),
  content: z.string().min(1),
  format: z.string().min(1),
  formatKey: z.enum(["text", "table", "image", "chart"]),
  groupTag: z.string().min(1),
  creationDate: z.coerce.date(),
});

/** Tipos de entrada */
export type ResourcesFiltersInput = z.infer<typeof ResourcesFiltersDto>;

/** Tipos de salida */
export type EducationalResourceOutput = z.infer<
  typeof EducationalResourceOutputDto
>;
