import { HttpAgent } from "@dfinity/agent";

export const HOST =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "http://localhost:8000"
    : "https://ic0.app";

export const IDENTITY_PROVIDER = process.env.IDENTITY_CANISTER_ID
  ? `http://${process.env.IDENTITY_CANISTER_ID}.localhost:8000`
  : undefined;

export const defaultAgent = new HttpAgent({
  host: HOST,
});

export const cyclesMintingCanisterId = "rkp4c-7iaaa-aaaaa-aaaca-cai";
