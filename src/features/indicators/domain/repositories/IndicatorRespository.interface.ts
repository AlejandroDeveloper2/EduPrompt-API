import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";
import { Indicator } from "../entities";

export interface IndicatorRepository {
  getIndicatorsByUser: (userId: string) => Promise<Indicator | null>;
  createIndicators: (userId: string, ctx?: TransactionContext) => Promise<void>;
  updateIndicators: (
    userId: string,
    updatedIndicators: Partial<Indicator>
  ) => Promise<void | null>;
}
