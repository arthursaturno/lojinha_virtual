import type { Failure } from "@/core/error/failure";

export type Result<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      failure: Failure;
    };

export const Result = {
  success<T>(data: T): Result<T> {
    return { ok: true, data };
  },

  failure<T = never>(failure: Failure): Result<T> {
    return { ok: false, failure };
  },
};
