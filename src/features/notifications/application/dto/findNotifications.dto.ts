import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";
import { LangTemplateDto } from "./createNotification.dto";

/** Dto de entrada */
export const ListNotificationsFilterDto = z.object({
  order: z.enum(["asc", "desc"]),
});

/** Dto de salida */
export const NotificationOutputDto = z.object({
  notificationId: objectIdSchema,
  title: LangTemplateDto,
  message: LangTemplateDto,
  links: z
    .array(
      z.object({
        label: LangTemplateDto,
        href: z.url(),
      })
    )
    .optional(),
  read: z.boolean(),
  creationDate: z.date(),
});

/** Tipos de entrada */
export type ListNotificationsFilterInput = z.infer<
  typeof ListNotificationsFilterDto
>;

/** Tipos de salida */
export type NotificationOutput = z.infer<typeof NotificationOutputDto>;
