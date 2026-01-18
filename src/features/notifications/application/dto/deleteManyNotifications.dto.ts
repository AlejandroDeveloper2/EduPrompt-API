import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

export const DeleteNotificationsByIdDto = z.object({
  notificationIds: z.array(objectIdSchema).min(1),
});

export type DeleteNotificationsByIdInput = z.infer<
  typeof DeleteNotificationsByIdDto
>;
