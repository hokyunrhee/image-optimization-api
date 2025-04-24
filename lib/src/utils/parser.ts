import middy from "@middy/core";

import createHttpError from "http-errors";
import { z, ZodType } from "zod";

/**
Parser middleware options for event and result validation
 */
export interface ParserOptions<TEventSchema extends ZodType, TResultSchema extends ZodType> {
  eventSchema?: TEventSchema;
  resultSchema?: TResultSchema;
}
/**
Type helpers for schema inference
 */
type ValidatedEvent<T extends ZodType> = T extends ZodType ? z.infer<T> : never;
/**
Middy middleware for validating Lambda events and results using Zod schemas
@example
```typescript
const handler = middy(async (event) => {
  // Your handler logic here
}).use(parser({
  eventSchema: z.object({ ... }),
  resultSchema: z.object({ ... })
}));
```
 */
export const parser = <TEventSchema extends ZodType, TResultSchema extends ZodType>(
  options: ParserOptions<TEventSchema, TResultSchema>,
): middy.MiddlewareObj => {
  const before = async (request: any): Promise<void> => {
    if (!options.eventSchema) return;
    const result = options.eventSchema.safeParse(request.event);
    if (result.error) throw createHttpError.BadRequest("Bad Request", { cause: result.error });
    request.event = result.data as ValidatedEvent<TEventSchema>;
  };
  const after = async (request: any): Promise<void> => {
    if (!options.resultSchema || !request.response) return;
    const result = options.resultSchema.safeParse(request.response);
    if (result.error)
      throw createHttpError.InternalServerError("Internal Server Error", {
        cause: result.error,
      });
  };
  return {
    before,
    after,
  };
};
