import { model, Schema } from "mongoose";

import { Prompt } from "../../../domain/entities";

/** Esquema de prompts en mongo db */
const PromptSchema = new Schema<Prompt>(
  {
    promptId: {
      type: String,
      required: true,
      unique: true,
    },
    promptTitle: {
      type: String,
      required: true,
    },
    promptText: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
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

export const PromptModel = model("prompts", PromptSchema);
