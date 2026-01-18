export type TransactionContext =
  | { session: import("mongoose").ClientSession }
  //   | { tx: import("@prisma/client").PrismaClient }
  | undefined;
