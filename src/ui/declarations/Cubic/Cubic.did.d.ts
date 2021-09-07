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
  'projectId' : bigint,
}
export interface Canisters { 'wtc' : Principal, 'xtc' : Principal }
export interface Cubic {
  'acceptCycles' : () => Promise<undefined>,
  'balance' : (arg_0: [] | [Principal]) => Promise<bigint>,
  'buy' : (arg_0: { 'newOffer' : bigint, 'projectId' : bigint }) => Promise<
      Result
    >,
  'canister_heartbeat' : () => Promise<undefined>,
  'depositXtc' : (arg_0: Principal) => Promise<bigint>,
  'details' : (arg_0: bigint) => Promise<[ProjectDetails_v2, Array<Block>]>,
  'getAllStatus' : () => Promise<Array<StatusAndOwner>>,
  'getBlocks' : (arg_0: BlocksRequest) => Promise<Array<Block>>,
  'getHistory' : (arg_0: HistoryRequest) => Promise<HistoryResponse>,
  'getStatus' : (arg_0: bigint) => Promise<StatusAndOwner>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'info' : () => Promise<Info>,
  'newProject' : (arg_0: ProjectDetails_v2) => Promise<undefined>,
  'restore' : () => Promise<undefined>,
  'setCanisters' : (arg_0: Canisters) => Promise<undefined>,
  'setControllers' : (arg_0: Array<Principal>) => Promise<undefined>,
  'setDetails' : (arg_0: SetDetailsRequest) => Promise<undefined>,
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
  { 'CannotPurchase' : null } |
  { 'InsufficientLiquidity' : null };
export type ErrorCode = { 'canister_error' : null } |
  { 'system_transient' : null } |
  { 'future' : number } |
  { 'canister_reject' : null } |
  { 'destination_invalid' : null } |
  { 'system_fatal' : null };
export type HeaderField = [string, string];
export interface HistoryRequest {
  'principal' : [] | [Principal],
  'projectId' : bigint,
}
export interface HistoryResponse {
  'transfers' : Array<Transfer>,
  'count' : bigint,
}
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface Info {
  'controllers' : Array<Principal>,
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
    'cyclesBalance' : bigint,
    'taxCollected' : bigint,
  },
  'canisters' : Canisters,
  'projectCount' : bigint,
}
export interface Initialization {
  'controller' : Principal,
  'canisters' : Canisters,
}
export type Memo = Array<number>;
export interface ProjectDetails_v2 {
  'creator' : string,
  'name' : string,
  'description' : string,
  'createdTime' : bigint,
  'isActive' : boolean,
}
export type Result = { 'ok' : null } |
  { 'err' : Error };
export interface SetDetailsRequest {
  'creator' : [] | [string],
  'name' : [] | [string],
  'description' : [] | [string],
  'createdTime' : [] | [bigint],
  'isActive' : [] | [boolean],
  'projectId' : bigint,
}
export interface StatusAndOwner { 'status' : Status_v2, 'owner' : [] | [Block] }
export interface Status_v2 {
  'offerTimestamp' : bigint,
  'owner' : Principal,
  'isForeclosed' : boolean,
  'offerValue' : bigint,
}
export interface StreamingCallbackHttpResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
}
export interface StreamingCallbackToken {
  'key' : string,
  'sha256' : [] | [Array<number>],
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
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
