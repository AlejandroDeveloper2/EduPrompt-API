import { Indicator } from "../entities";

export type CreateIndicator = Omit<Indicator, "indicatorId">;
