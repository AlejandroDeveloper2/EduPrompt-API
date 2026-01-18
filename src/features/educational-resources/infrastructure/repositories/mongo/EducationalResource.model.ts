import { model, Schema } from "mongoose";

import { EducationalResource } from "../../../domain/entities";

/** Esquema de recursos en mongo db */
const ResourceSchema = new Schema<EducationalResource>(
  {
    resourceId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    formatKey: {
      type: String,
      enum: ["text", "table", "image", "chart"],
      required: true,
    },
    groupTag: {
      type: String,
      required: true,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const EducationalResourceModel = model(
  "educational_resources",
  ResourceSchema
);
