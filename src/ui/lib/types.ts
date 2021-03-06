import { ActorSubclass } from "@dfinity/agent";
import Cubic, {
  Block,
  BlocksRequest,
  Summary,
} from "../declarations/Cubic/Cubic.did";
import ledger from "../declarations/ledger/ledger.did";
import Wtc, { TransferResponse } from "../declarations/wtc/wtc.did";
import Xtc from "../declarations/xtc/xtc.did";

export type Modify<T, R> = Omit<T, keyof R> & R;
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type CubicService = ActorSubclass<Cubic._SERVICE>;
export type XtcService = ActorSubclass<Xtc._SERVICE>;
export type WtcService = ActorSubclass<Wtc._SERVICE>;
export type LedgerService = ActorSubclass<ledger._SERVICE>;

export type ExtTransferError = Extract<TransferResponse, { err: {} }>["err"];

export type WrappedTcAsset = "XTC" | "WTC";
export type TcAsset = WrappedTcAsset | "Cycles";
export type Asset = TcAsset | "CUBE" | "ICP";

export type OrderBy = KeysOfUnion<BlocksRequest["orderBy"]>;
export type Order = KeysOfUnion<BlocksRequest["order"]>;

export type ParsedSummary = {
  projectId: string;
  details: Summary["details"];
  status: Modify<Summary["status"], { offerValue: number }>;
  owner: Block | null;
};
