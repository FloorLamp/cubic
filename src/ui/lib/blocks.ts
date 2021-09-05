import { Principal } from "@dfinity/principal";
import { Block } from "../declarations/Cubic/Cubic.did";

export const cubicName = (id: string) => id.padStart(3, "0");

export const cubicDescriptions = {
  "0": "This simple spiral square will produce a pleasing array of colors.",
};

export const principalHash = (principal: Principal) => {
  let hash = 0;
  const bytes = principal.toUint8Array();
  for (const byte of bytes) {
    hash = byte + (hash << 5) - hash;
    hash = hash & hash;
  }
  return hash >>> 0;
};

export const principalColor = (principal?: Principal) => {
  if (!principal) return "";

  let hash = principalHash(principal);
  return `hsl(${hash % 360},100%,50%)`;
};

export const ownerColor = (owner: Block) => {
  if (!owner) return "";

  let hash = principalHash(owner.owner);

  const sat =
    owner.totalValue < BigInt(1e12)
      ? 0
      : owner.totalValue < BigInt(10 * 1e12)
      ? 25
      : owner.totalValue < BigInt(100 * 1e12)
      ? 50
      : owner.totalValue < BigInt(1000 * 1e12)
      ? 75
      : 100;
  return `hsl(${hash % 360},${sat}%,50%)`;
};
