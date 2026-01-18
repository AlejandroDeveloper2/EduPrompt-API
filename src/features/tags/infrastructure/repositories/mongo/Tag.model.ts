import { model, Schema } from "mongoose";

import { Tag } from "@/features/tags/domain/entities";

/** Esquema de mongo para la entidad Tag  */
const TagSchema = new Schema<Tag>(
  {
    tagId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["prompt_tag", "resource_tag"],
      required: true,
    },
    sync: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, versionKey: false }
);

export const TagModel = model("tags", TagSchema);
