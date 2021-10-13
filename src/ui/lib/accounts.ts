import { Principal } from "@dfinity/principal";
import { getCrc32 } from "@dfinity/principal/lib/cjs/utils/getCrc.js";
import { sha224 } from "@dfinity/principal/lib/cjs/utils/sha224.js";

export const addCrc32 = (buf: Buffer): Buffer => {
  const crc32Buf = Buffer.alloc(4);
  crc32Buf.writeUInt32BE(getCrc32(buf), 0);
  return Buffer.concat([crc32Buf, buf]);
};

export const accountIdentifierFromSubaccount = (
  principal: Buffer,
  subaccount: Buffer
) => {
  const preimage = Buffer.concat([
    Buffer.from("\x0Aaccount-id"),
    principal,
    subaccount,
  ]);
  const hashed = Buffer.from(sha224(preimage));
  return addCrc32(hashed).toString("hex");
};

export const firstAccountOfPrincipal = (principal: Principal) =>
  accountIdentifierFromSubaccount(
    Buffer.from(principal.toUint8Array()),
    Buffer.from(Array(32).fill(0))
  );

export const padSubaccountArray = (arg: Array<number>) =>
  arg.concat(Array(32 - arg.length).fill(0));

export const makeCanisterIdSubaccount = (canisterId: string) => {
  let arr = Array.from(Principal.fromText(canisterId).toUint8Array());
  arr = [arr.length].concat(arr);
  return padSubaccountArray(arr);
};
