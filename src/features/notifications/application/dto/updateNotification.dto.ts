import { z } from "zod/v4";

import { CreateNotificationDto } from "./createNotification.dto";

export const UpdateNotificationDto = CreateNotificationDto;

export type UpdateNotificationInput = z.infer<typeof UpdateNotificationDto>;
