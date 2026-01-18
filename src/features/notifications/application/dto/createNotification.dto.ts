import { z } from "zod/v4";

export const LangTemplateDto = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
  pt: z.string().min(1),
});

export const CreateNotificationDto = z.object({
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
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationDto>;
