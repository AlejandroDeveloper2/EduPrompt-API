import { z } from "zod/v4";

import { DeleteNotificationsByIdDto } from "./deleteManyNotifications.dto";

export const MarkAsReadNotificationsDto = DeleteNotificationsByIdDto;

export type MarkAsReadNotificationsInput = z.infer<
  typeof MarkAsReadNotificationsDto
>;
