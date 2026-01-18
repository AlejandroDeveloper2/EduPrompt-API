import { model, Schema } from "mongoose";

import { Indicator } from "@/features/indicators/domain/entities";

export interface MongoIndicator extends Omit<Indicator, "indicatorId"> {
  _id: string;
  createdAt: Date;
}

/** Esquema de indicadores en mongo db */
const IndicatorSchema = new Schema<MongoIndicator>(
  {
    generatedResources: {
      type: Number,
      default: 0,
    },
    usedTokens: {
      type: Number,
      default: 0,
    },
    lastGeneratedResource: {
      type: String,
      default: null,
    },
    dowloadedResources: {
      type: Number,
      default: 0,
    },
    savedResources: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const IndicatorModel = model("indicators", IndicatorSchema);
