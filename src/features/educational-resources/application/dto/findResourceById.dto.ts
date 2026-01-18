import { z } from "zod/v4";

export const ResourceIdParamDto = z.object({
  resourceId: z.uuidv4(),
});
