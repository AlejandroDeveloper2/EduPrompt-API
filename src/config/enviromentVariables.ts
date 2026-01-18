import dotenv from "dotenv";

dotenv.config();

/** Constante con la configuración y variables de entorno necesarias para el proyecto */
export const config = {
  PORT: process.env.PORT || 3000,
  LOCAL_MONGO_DB_URI: process.env.LOCAL_MONGO_DB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  NODE_MAILER_USER: process.env.NODE_MAILER_USER || "",
  NODE_MAILER_PASSWORD: process.env.NODE_MAILER_PASSWORD || "",
  ADMIN_USER: process.env.ADMIN_USER || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
  OPEN_IA_API_KEY: process.env.OPEN_IA_API_KEY || "",
};
