import { z } from "zod/v4";
import { ObjectId } from "mongodb";

//Schema para validar ObjectID
export const objectIdSchema = z
  .string()
  .refine((val) => ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });
