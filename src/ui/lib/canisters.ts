import { HttpAgent } from "@dfinity/agent";

export const HOST =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "http://localhost:8000"
    : "https://ic0.app";

export const IDENTITY_PROVIDER =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "http://ryjl3-tyaaa-aaaaa-aaaba-cai.localhost:8000"
    : undefined;

export const defaultAgent = new HttpAgent({
  host: HOST,
});
