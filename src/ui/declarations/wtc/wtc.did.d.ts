import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export type Balance = bigint;
export interface BalanceRequest { 'token' : TokenIdentifier, 'user' : User }
export type BalanceResponse = { 'ok' : Balance } |
  { 'err' : CommonError__1 };
export type Balance__1 = bigint;
export type Callback = () => Promise<undefined>;
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export type CommonError__1 = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export type Extension = string;
export type Memo = Array<number>;
export type Metadata = {
    'fungible' : {
      'decimals' : number,
      'metadata' : [] | [Array<number>],
      'name' : string,
      'symbol' : string,
    }
  } |
  { 'nonfungible' : { 'metadata' : [] | [Array<number>] } };
export type Result = { 'ok' : Balance__1 } |
  { 'err' : CommonError };
export type Result_1 = { 'ok' : Metadata } |
  { 'err' : CommonError };
export type SubAccount = Array<number>;
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export interface TransferRequest {
  'to' : User,
  'fee' : Balance,
  'token' : TokenIdentifier,
  'notify' : boolean,
  'from' : User,
  'memo' : Memo,
  'subaccount' : [] | [SubAccount],
  'amount' : Balance,
}
export type TransferResponse = { 'ok' : Balance } |
  {
    'err' : { 'CannotNotify' : AccountIdentifier } |
      { 'InsufficientBalance' : null } |
      { 'InvalidToken' : TokenIdentifier } |
      { 'Rejected' : null } |
      { 'Unauthorized' : AccountIdentifier } |
      { 'Other' : string }
  };
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export type User__1 = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface _SERVICE {
  'acceptCycles' : () => Promise<undefined>,
  'actualCycles' : () => Promise<bigint>,
  'availableCycles' : () => Promise<bigint>,
  'balance' : (arg_0: BalanceRequest) => Promise<BalanceResponse>,
  'balance_secure' : (arg_0: BalanceRequest) => Promise<BalanceResponse>,
  'balances' : () => Promise<Array<[AccountIdentifier__1, Balance__1]>>,
  'burn' : (arg_0: Balance__1, arg_1: [Principal, string]) => Promise<boolean>,
  'extensions' : () => Promise<Array<Extension>>,
  'extensions_secure' : () => Promise<Array<Extension>>,
  'fee' : () => Promise<Balance__1>,
  'metadata' : (arg_0: TokenIdentifier__1) => Promise<Result_1>,
  'metadata_secure' : (arg_0: TokenIdentifier__1) => Promise<Result_1>,
  'minCyclesThreshold' : () => Promise<Balance__1>,
  'mint' : (arg_0: [] | [User__1]) => Promise<undefined>,
  'supply' : (arg_0: TokenIdentifier__1) => Promise<Result>,
  'supply_secure' : (arg_0: TokenIdentifier__1) => Promise<Result>,
  'transfer' : (arg_0: TransferRequest) => Promise<TransferResponse>,
}
