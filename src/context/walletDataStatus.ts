export type WalletDataStatus = "loading" | "error" | "ready";

export default function getWalletDataStatus(
  loadingStates: boolean[],
  errors: Array<Error | null | undefined>,
  loadingTimedOut = false,
): WalletDataStatus {
  if (errors.some(Boolean)) return "error";
  if (loadingTimedOut && loadingStates.some(Boolean)) return "error";
  if (loadingStates.some(Boolean)) return "loading";
  return "ready";
}
