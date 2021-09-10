import { Principal } from "@dfinity/principal";

export const padProjectId = (id: bigint | string) => {
  if (typeof id === "bigint") {
    id = id.toString();
  }
  return id.padStart(3, "0");
};

export const principalHash = (principal: Principal) => {
  let hash = 0;
  const bytes = principal.toUint8Array();
  for (const byte of bytes) {
    hash += byte + (hash << 1);
    hash &= hash;
  }
  return hash >>> 0;
};

export const principalColor = (principal?: Principal) => {
  if (!principal) return "";

  let hash = principalHash(principal);
  return `hsl(${hash % 360},100%,50%)`;
};
