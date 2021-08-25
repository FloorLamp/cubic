import { HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import fetch from "node-fetch";
import { createActor as createActorCubic } from "../declarations/Cubic";
import { createActor as createActorLedger } from "../declarations/ledger";
import { createActor as createActorMinter } from "../declarations/Minter";
import { HOST } from "../lib/canisters";
import logger from "./logger";
(global as any).fetch = fetch;

let SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  logger.error("SECRET_KEY is not set!");
}

export const defaultAgent = new HttpAgent({
  identity: Ed25519KeyIdentity.fromSecretKey(Buffer.from(SECRET_KEY, "hex")),
  host: HOST,
});

defaultAgent.getPrincipal().then((pr) => {
  const minterPrincipal = pr.toText();
  if (process.env.NEXT_PUBLIC_MINTER_PRINCIPAL !== minterPrincipal) {
    logger.error(
      `NEXT_PUBLIC_MINTER_PRINCIPAL=${process.env.NEXT_PUBLIC_MINTER_PRINCIPAL} but we are using ${minterPrincipal}!`
    );
  }
});

export const cubic = createActorCubic(defaultAgent);
export const ledger = createActorLedger(defaultAgent);
export const minter = createActorMinter(defaultAgent);
