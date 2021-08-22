import { Principal } from "@dfinity/principal";

export const principalColor = (p: Principal) => {
  let hash = 0;
  const bytes = p.toUint8Array();
  for (const byte of bytes) {
    hash = byte + (hash << 5) - hash;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `hsl(${hash % 360},100%,50%)`;
};
