import { Schema, model } from "mongoose";

export interface MongoApiKey {
  _id: string;
  keyId: string;
  name: string;
  secretHash: string;
  scopes: string[];
  active: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
}

const apiKeySchema = new Schema<MongoApiKey>(
  {
    keyId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    secretHash: { type: String, required: true },
    scopes: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    createdAt: { type: Date, default: () => new Date() },
    lastUsedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

export const ApiKeyModel = model("api_keys", apiKeySchema);
