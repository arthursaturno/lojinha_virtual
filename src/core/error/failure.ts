export type FailureType =
  | "network"
  | "timeout"
  | "unauthorized"
  | "validation"
  | "unknown";

export type Failure = {
  type: FailureType;
  message: string;
};
