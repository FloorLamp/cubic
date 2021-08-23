import { ActorSubclass } from "@dfinity/agent";
import Cubic, {
  Block,
  BlocksRequest,
  Status,
} from "../declarations/Cubic/Cubic.did";
import Wtc, { TransferResponse } from "../declarations/wtc/wtc.did";
import Xtc from "../declarations/xtc/xtc.did";

export type Modify<T, R> = Omit<T, keyof R> & R;
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type CubicService = ActorSubclass<Cubic._SERVICE>;
export type XtcService = ActorSubclass<Xtc._SERVICE>;
export type WtcService = ActorSubclass<Wtc._SERVICE>;

export type ExtTransferError = Extract<TransferResponse, { err: {} }>["err"];

export type TcAsset = "XTC" | "WTC";
export type Asset = TcAsset | "CUBE";

export type OrderBy = KeysOfUnion<BlocksRequest["orderBy"]>;
export type Order = KeysOfUnion<BlocksRequest["order"]>;

export type ParsedStatus = {
  status: Modify<Status, { offerValue: number }>;
  block: Block | null;
};
