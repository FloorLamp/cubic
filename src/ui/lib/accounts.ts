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
