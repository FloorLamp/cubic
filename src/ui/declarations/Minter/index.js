import { Actor } from "@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from "./Minter.did.js";
export { idlFactory } from "./Minter.did.js";
export const canisterId = process.env.MINTER_CANISTER_ID;

/**
 * @param {{agent: import("@dfinity/agent").HttpAgent}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./Minter.did.js")._SERVICE>}
 */
export const createActor = (agent) => {
  // Fetch root key for certificate validation during development
  if (process.env.NEXT_PUBLIC_DFX_NETWORK === "local") {
    agent.fetchRootKey();
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
