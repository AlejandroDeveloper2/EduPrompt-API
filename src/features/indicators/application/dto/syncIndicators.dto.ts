import { z } from "zod/v4";

import { CreateIndicatorsDto } from "./createIndicators.dto";

export const SyncIndicatorsDto = CreateIndicatorsDto;

export type SyncIndicatorsInput = z.infer<typeof SyncIndicatorsDto>;
