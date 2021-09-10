import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import extendProtobuf from "agent-pb";
import protobuf, { INamespace } from "protobufjs";
import protobufJson from "./proto.json";

export const HOST =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "http://localhost:8000"
    : "https://ic0.app";

export const IDENTITY_PROVIDER = process.env.IDENTITY_CANISTER_ID
  ? `http://${process.env.IDENTITY_CANISTER_ID}.localhost:8000`
  : undefined;

export const defaultAgent = new HttpAgent({
  host: HOST,
});

export const cyclesMintingCanisterId = "rkp4c-7iaaa-aaaaa-aaaca-cai";
export const protobufRoot = protobuf.Root.fromJSON(protobufJson as INamespace);

export const registry = Actor.createActor(() => IDL.Service({}), {
  agent: defaultAgent,
  canisterId: "rwlgt-iiaaa-aaaaa-aaaaa-cai",
});
extendProtobuf(registry, protobufRoot.lookupService("Registry"));
