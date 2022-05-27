import { Context } from "./createContext";
import { IS_MAINTENANCE, serverInMaintenance } from "@skeleton/lib";
import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";

export function createRouter() {
  return trpc.router<Context>().middleware(({ ctx, next }) => {
    if (IS_MAINTENANCE)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: serverInMaintenance,
      });

    return next({
      ctx,
    });
  });
}
