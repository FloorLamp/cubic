import { Principal } from "@dfinity/principal";
import { Block } from "../declarations/Cubic/Cubic.did";

export const principalColor = (principal?: Principal) => {
  if (!principal) return "";

  let hash = 0;
  const bytes = principal.toUint8Array();
  for (const byte of bytes) {
    hash = byte + (hash << 5) - hash;
    hash = hash & hash;
  }
  return `hsl(${hash % 360},100%,50%)`;
};

export const blockColor = (block: Block) => {
  if (!block) return "";

  let hash = 0;
  const bytes = block.owner.toUint8Array();
  for (const byte of bytes) {
    hash = byte + (hash << 5) - hash;
    hash = hash & hash;
  }

  const sat =
    block.totalValue < BigInt(1e12)
      ? 0
      : block.totalValue < BigInt(10 * 1e12)
      ? 25
      : block.totalValue < BigInt(100 * 1e12)
      ? 50
      : block.totalValue < BigInt(1000 * 1e12)
      ? 75
      : 100;
  return `hsl(${hash % 360},${sat}%,50%)`;
};
