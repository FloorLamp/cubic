import type { Principal } from '@dfinity/principal';
export type MintError = { 'NotSufficientLiquidity' : null };
export interface Minter {
  'close' : () => Promise<Response>,
  'isActive' : () => Promise<boolean>,
  'open' : (arg_0: Request) => Promise<boolean>,
}
export interface Request {
  'token' : { 'wtc' : null } |
    { 'xtc' : null },
  'recipient' : Principal,
}
export type Response = {
    'Ok' : { 'xtcTransactionId' : [] | [TransactionId], 'amount' : bigint }
  } |
  { 'Err' : MintError } |
  { 'NoCyclesReceived' : null } |
  { 'NoRecipient' : null };
export type TransactionId = bigint;
export interface _SERVICE extends Minter {}
