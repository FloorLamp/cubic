import { Actor } from "@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from "./wtc.did.js";
export { idlFactory } from "./wtc.did.js";
export const canisterId = process.env.WTC_CANISTER_ID;

/**
 *
 * @param {string | Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./wtc.did.js")._SERVICE>}
 */
export const createActor = (canisterId, agent) => {
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
