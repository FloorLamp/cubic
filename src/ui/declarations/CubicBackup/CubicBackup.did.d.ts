import type { Principal } from '@dfinity/principal';
export interface Backup {
  'foreclosureCount' : bigint,
  'wtcBalance' : bigint,
  'ledgerEntries' : Array<PrincipalToNatEntry>,
  'feesCollected' : bigint,
  'lastTaxTimestamp' : bigint,
  'salesTotal' : bigint,
  'cubesSupply' : bigint,
  'dataEntries' : Array<DataEntry_shared>,
  'xtcBalance' : bigint,
  'taxCollected' : bigint,
}
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
export interface CubicBackup {
  'get' : () => Promise<Backup>,
  'load' : (arg_0: Backup) => Promise<undefined>,
}
export interface DataEntry_shared {
  'status' : Status,
  'artId' : bigint,
  'owners' : Array<Block>,
  'transfers' : Array<Transfer>,
  'ownerIdEntries' : Array<PrincipalToNatEntry>,
}
export type PrincipalToNatEntry = [Principal, bigint];
export interface Status {
  'offerTimestamp' : bigint,
  'owner' : Principal,
  'offerValue' : bigint,
}
export interface Transfer {
  'id' : bigint,
  'to' : Principal,
  'value' : bigint,
  'from' : Principal,
  'timestamp' : bigint,
}
export interface _SERVICE extends CubicBackup {}
