import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export type Balance = bigint;
export interface Block {
  'id' : bigint,
  'totalSaleCount' : bigint,
  'totalValue' : bigint,
  'owner' : Principal,
  'lastPurchasePrice' : bigint,
  'lastSaleTime' : bigint,
  'lastSalePrice' : bigint,
  'totalOwnedTime' : bigint,
}
export interface BlocksRequest {
  'order' : { 'asc' : null } |
    { 'desc' : null },
  'orderBy' : { 'id' : null } |
    { 'totalSaleCount' : null } |
    { 'totalValue' : null } |
    { 'lastPurchasePrice' : null } |
    { 'lastSaleTime' : null } |
    { 'lastSalePrice' : null } |
    { 'totalOwnedTime' : null },
}
export interface Canisters { 'wtc' : Principal, 'xtc' : Principal }
export interface Cubic {
  'acceptCycles' : () => Promise<undefined>,
  'art' : () => Promise<Array<Block>>,
  'balance' : (arg_0: [] | [Principal]) => Promise<bigint>,
  'buy' : (arg_0: bigint) => Promise<Result>,
  'canister_heartbeat' : () => Promise<undefined>,
  'depositXtc' : (arg_0: Principal) => Promise<bigint>,
  'getBlocks' : (arg_0: BlocksRequest) => Promise<Array<Block>>,
  'getHistory' : (arg_0: HistoryRequest) => Promise<HistoryResponse>,
  'getStatus' : () => Promise<[Status, [] | [Block]]>,
  'info' : () => Promise<Info>,
  'info_secure' : () => Promise<Info>,
  'setCanisters' : (arg_0: Canisters) => Promise<undefined>,
  'tokenTransferNotification' : (
      arg_0: TokenIdentifier,
      arg_1: User,
      arg_2: Balance,
      arg_3: Memo,
    ) => Promise<[] | [Balance]>,
  'wallet_receive' : () => Promise<bigint>,
  'withdraw' : (arg_0: WithdrawRequest) => Promise<Result>,
}
export type Error = {
    'Error' : { 'error_message' : string, 'error_type' : ErrorCode }
  } |
  { 'InsufficientBalance' : null } |
  { 'XtcTransferError' : TransferError__1 } |
  { 'WtcTransferError' : TransferError } |
  { 'InsufficientLiquidity' : null };
export type ErrorCode = { 'canister_error' : null } |
  { 'system_transient' : null } |
  { 'future' : number } |
  { 'canister_reject' : null } |
  { 'destination_invalid' : null } |
  { 'system_fatal' : null };
export interface HistoryRequest { 'principal' : [] | [Principal] }
export interface HistoryResponse {
  'transfers' : Array<Transfer>,
  'count' : bigint,
}
export interface Info {
  'stats' : {
    'foreclosureCount' : bigint,
    'transactionFee' : bigint,
    'wtcBalance' : bigint,
    'feesCollected' : bigint,
    'lastTaxTimestamp' : bigint,
    'transactionsCount' : bigint,
    'salesTotal' : bigint,
    'cubesSupply' : bigint,
    'ownCubesBalance' : bigint,
    'annualTaxRate' : bigint,
    'xtcBalance' : bigint,
    'ownerCount' : bigint,
    'cyclesBalance' : bigint,
    'taxCollected' : bigint,
  },
  'canisters' : Canisters,
}
export interface Initialization {
  'controller' : Principal,
  'canisters' : Canisters,
  'defaultValue' : bigint,
}
export type Memo = Array<number>;
export type Result = { 'ok' : null } |
  { 'err' : Error };
export interface Status {
  'offerTimestamp' : bigint,
  'owner' : Principal,
  'offerValue' : bigint,
}
export type TokenIdentifier = string;
export interface Transfer {
  'id' : bigint,
  'to' : Principal,
  'value' : bigint,
  'from' : Principal,
  'timestamp' : bigint,
}
export type TransferError = { 'CannotNotify' : AccountIdentifier } |
  { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Rejected' : null } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
export type TransferError__1 = { 'CallFailed' : null } |
  { 'InsufficientBalance' : null } |
  { 'Unknown' : null } |
  { 'AmountTooLarge' : null };
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface WithdrawRequest {
  'asset' : { 'WTC' : null } |
    { 'XTC' : null },
  'amount' : bigint,
}
export interface _SERVICE extends Cubic {}
