import { Principal } from "@dfinity/principal";
import { Block } from "../declarations/Cubic/Cubic.did";

export const generateBlocks = (length = 100): Block[] => {
  return Array.from({ length }, (_, i) => {
    const array = new Uint8Array(8);
    typeof window !== "undefined" && window.crypto.getRandomValues(array);
    return {
      totalValue: BigInt(Math.floor(Math.random() * 1000) * 1e12),
      totalOwnedTime: BigInt(Math.floor(Math.random() * 86_400 * 40) * 1e9),
      owner: Principal.fromUint8Array(array),
    };
  });
};
