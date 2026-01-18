import { z } from "zod/v4";

/** Dto de entrada */
export const UpdateIndicatorsDto = z.object({
  generatedResources: z.number().positive().optional(),
  usedTokens: z.number().positive().optional(),
  lastGeneratedResource: z.string().nullable().optional(),
  dowloadedResources: z.number().positive().optional(),
  savedResources: z.number().positive().optional(),
});

/** Tipos de entrada */
export type UpdateIndicatorInput = z.infer<typeof UpdateIndicatorsDto>;
