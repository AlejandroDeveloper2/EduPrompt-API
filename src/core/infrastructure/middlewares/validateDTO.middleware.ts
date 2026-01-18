import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod/v4";

import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

/**
 * Middleware para validar y sanitizar una parte específica de la solicitud HTTP (`body`, `query` o `params`) usando un esquema de Zod.
 *
 * @template T - Tipo inferido a partir del esquema de Zod proporcionado.
 * @param schema - Esquema de Zod que define la estructura y validaciones esperadas para la parte de la solicitud a validar.
 * @param reqParameter - Indica qué parte del objeto `Request` se debe validar: `"body"`, `"query"` o `"params"`.
 * @returns Middleware de Express que valida la parte indicada del request contra el esquema dado.
 *
 * Si la validación falla, responde con un error 400 y una lista de los problemas encontrados.
 * Si la validación es exitosa, sobrescribe `req.body` con los datos parseados y sanitizados (independientemente de la parte validada), y llama a `next()`.
 *
 * @example
 * ```typescript
 * import { z } from "zod";
 * const userSchema = z.object({ name: z.string(), age: z.number() });
 * app.post("/users", validateBody(userSchema, "body"), (req, res) => { ... });
 * app.get("/users", validateBody(userSchema, "query"), (req, res) => { ... });
 * ```
 */
export const validateDTO = <T>(
  schema: ZodType<T>,
  reqParameter: "body" | "query" | "params"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[reqParameter]);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      return next(
        new AppError(
          ErrorMessages.VALIDATION_ERROR,
          400,
          `Error validation at fields: ${JSON.stringify(issues)}`,
          true
        )
      );
    }
    if (reqParameter === "query") {
      Object.assign(req.query, parsed.data);
    } else if (reqParameter === "params") {
      Object.assign(req.params, parsed.data);
    } else {
      req.body = parsed.data;
    }
    next();
  };
};
