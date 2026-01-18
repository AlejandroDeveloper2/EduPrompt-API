import { z } from "zod/v4";

/** Dto de entrada */
export const CreateIndicatorsDto = z.object({
  generatedResources: z.number().positive(),
  usedTokens: z.number().positive(),
  lastGeneratedResource: z.string().nullable(),
  dowloadedResources: z.number().positive(),
  savedResources: z.number().positive(),
});

/** Tipos de entrada */
export type CreateIndicatorInput = z.infer<typeof CreateIndicatorsDto>;
