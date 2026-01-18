import { model, Schema } from "mongoose";

import { LangTemplate } from "@/features/notifications/domain/types";

import { Notification } from "../../../domain/entities";

export interface MongoNotification
  extends Omit<Notification, "notificationId"> {
  _id: string;
}

const LangTemplateSchema = new Schema<LangTemplate>(
  {
    en: { type: String, required: true },
    es: { type: String, required: true },
    pt: { type: String, required: true },
  },
  { _id: false, timestamps: false, versionKey: false }
);

/** Esquema de notificaciones en mongo db */
const NotificaitonLinkSchema = new Schema(
  {
    label: LangTemplateSchema,
    href: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, versionKey: false, _id: false }
);

const NotificationSchema = new Schema<MongoNotification>(
  {
    title: LangTemplateSchema,
    message: LangTemplateSchema,
    links: {
      type: [NotificaitonLinkSchema],
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const NotificationModel = model("notifications", NotificationSchema);
