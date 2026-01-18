import { Notification } from "../entities";

type LangTemplate = { en: string; es: string; pt: string };

type NotificationLink = {
  label: LangTemplate;
  href: string;
};
type Order = "asc" | "desc";

type CreateNotification = Omit<
  Notification,
  "notificationId" | "creationDate" | "read"
>;
type UpdateNotification = CreateNotification;

export type {
  LangTemplate,
  NotificationLink,
  Order,
  CreateNotification,
  UpdateNotification,
};
