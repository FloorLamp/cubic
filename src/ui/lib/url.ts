import { canisterId } from "../declarations/Cubic";

export const assetUrl = (path: string = "", cacheBuster?: string) =>
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? `http://localhost:8000/${path}?canisterId=${canisterId}${
        cacheBuster ? `&ts=${cacheBuster}` : ""
      }`
    : `https://${canisterId}.raw.ic0.app/${path}${
        cacheBuster ? `?ts=${cacheBuster}` : ""
      }`;
