import type { Principal } from '@dfinity/principal';
export interface Minter {
  'close' : () => Promise<boolean>,
  'isActive' : () => Promise<boolean>,
  'open' : (arg_0: Request) => Promise<boolean>,
}
export interface Request {
  'principal' : Principal,
  'token' : { 'wtc' : null } |
    { 'xtc' : null },
}
export interface _SERVICE extends Minter {}
