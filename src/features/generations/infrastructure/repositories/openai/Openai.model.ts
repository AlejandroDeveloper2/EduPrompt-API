import OpenAI from "openai";

import { config } from "@/config/enviromentVariables";

export const openai = new OpenAI({ apiKey: config.OPEN_IA_API_KEY });
