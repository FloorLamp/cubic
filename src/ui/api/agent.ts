import { HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import fetch from "node-fetch";
import nacl from "tweetnacl";
import { createActor as createActorCubic } from "../declarations/Cubic";
import { createActor as createActorLedger } from "../declarations/ledger";
import { createActor as createActorMinter } from "../declarations/Minter";
import { HOST } from "../lib/canisters";
import logger from "./logger";
(global as any).fetch = fetch;

let SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  logger.error("SECRET_KEY is not set");
  const kp = nacl.sign.keyPair();
  SECRET_KEY = Buffer.from(kp.secretKey).toString("hex");
  logger.info(`generated new key: ${SECRET_KEY}`);
}

export const defaultAgent = new HttpAgent({
  identity: Ed25519KeyIdentity.fromSecretKey(Buffer.from(SECRET_KEY, "hex")),
  host: HOST,
});

export let principal: Principal;
defaultAgent.getPrincipal().then((pr) => {
  principal = pr;
  logger.info(`principal: ${pr.toText()}`);
});

export const cubic = createActorCubic(defaultAgent);
export const ledger = createActorLedger(defaultAgent);
export const minter = createActorMinter(defaultAgent);
