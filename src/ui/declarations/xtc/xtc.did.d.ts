import type { Principal } from "@dfinity/principal";
export type BurnError =
  | { InsufficientBalance: null }
  | { InvalidTokenContract: null }
  | { NotSufficientLiquidity: null };
export type BurnResult = { Ok: TransactionId } | { Err: BurnError };
export type CreateResult = { Ok: { canister_id: Principal } } | { Err: string };
export interface Event {
  fee: bigint;
  kind: EventDetail;
  cycles: bigint;
  timestamp: bigint;
}
export type EventDetail =
  | {
      Burn: { to: Principal; from: Principal };
    }
  | { Mint: { to: Principal } }
  | { CanisterCreated: { from: Principal; canister: Principal } }
  | {
      CanisterCalled: {
        from: Principal;
        method_name: string;
        canister: Principal;
      };
    }
  | { Transfer: { to: Principal; from: Principal } };
export interface EventsConnection {
  data: Array<Event>;
  next_canister_id: [] | [Principal];
}
export type MintError = { NotSufficientLiquidity: null };
export type MintResult = { Ok: TransactionId } | { Err: MintError };
export type ResultCall = { Ok: { return: Array<number> } } | { Err: string };
export type ResultSend = { Ok: null } | { Err: string };
export interface Stats {
  transfers_count: bigint;
  balance: bigint;
  mints_count: bigint;
  canisters_created_count: bigint;
  supply: bigint;
  burns_count: bigint;
  proxy_calls_count: bigint;
  history_events: bigint;
}
export interface TokenMetaData {
  features: Array<string>;
  name: string;
  decimal: number;
  symbol: string;
}
export type TransactionId = bigint;
export type TransferError =
  | { CallFailed: null }
  | { InsufficientBalance: null }
  | { Unknown: null }
  | { AmountTooLarge: null };
export type TransferResponse = { Ok: TransactionId } | { Err: TransferError };
export interface Xtc {
  balance: (arg_0: [] | [Principal]) => Promise<bigint>;
  burn: (arg_0: {
    canister_id: Principal;
    amount: bigint;
  }) => Promise<BurnResult>;
  events: (arg_0: {
    from: [] | [bigint];
    limit: number;
  }) => Promise<EventsConnection>;
  get_transaction: (arg_0: TransactionId) => Promise<[] | [Event]>;
  halt: () => Promise<undefined>;
  meta: () => Promise<TokenMetaData>;
  meta_certified: () => Promise<TokenMetaData>;
  mint: (arg_0: [] | [Principal]) => Promise<MintResult>;
  name: () => Promise<[] | [string]>;
  stats: () => Promise<Stats>;
  transfer: (arg_0: {
    to: Principal;
    amount: bigint;
  }) => Promise<TransferResponse>;
  wallet_balance: () => Promise<{ amount: bigint }>;
  wallet_call: (arg_0: {
    args: Array<number>;
    cycles: bigint;
    method_name: string;
    canister: Principal;
  }) => Promise<ResultCall>;
  wallet_create_canister: (arg_0: {
    controller: [] | [Principal];
    cycles: bigint;
  }) => Promise<CreateResult>;
  wallet_create_wallet: (arg_0: {
    controller: [] | [Principal];
    cycles: bigint;
  }) => Promise<CreateResult>;
  wallet_send: (arg_0: {
    canister: Principal;
    amount: bigint;
  }) => Promise<ResultSend>;
}

export interface _SERVICE extends Xtc {}
