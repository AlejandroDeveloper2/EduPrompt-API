import z from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

/** Dto de entrada */
export const NotificationIdParamDto = z.object({
  notificationId: objectIdSchema,
});
