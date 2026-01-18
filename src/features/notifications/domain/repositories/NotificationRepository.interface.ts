import { Notification } from "../entities";
import { CreateNotification, Order, UpdateNotification } from "../types";

export interface NotificationRepositoryType {
  findAll: (order: Order) => Promise<Notification[]>;
  create: (newNotification: CreateNotification) => Promise<void>;
  findById: (notificationId: string) => Promise<Notification | null>;
  update: (
    notificationId: string,
    updatedNotification: UpdateNotification
  ) => Promise<void | null>;
  deleteMany: (notificationIds: string[]) => Promise<void>;
  count: (notificationIds: string[]) => Promise<number>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
}
