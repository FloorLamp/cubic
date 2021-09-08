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
  'status' : Status_v2,
  'owners' : Array<Block>,
  'ownerIdEntries' : Array<PrincipalToNatEntry>,
  'projectId' : bigint,
  'events' : Array<Event>,
  'details' : ProjectDetails_v2,
}
export interface Event {
  'id' : bigint,
  'data' : { 'Transfer' : TransferEvent } |
    { 'PriceChange' : PriceChange },
  'timestamp' : bigint,
}
export interface PriceChange {
  'to' : bigint,
  'owner' : Principal,
  'from' : bigint,
}
export type PrincipalToNatEntry = [Principal, bigint];
export interface ProjectDetails_v2 {
  'creator' : string,
  'name' : string,
  'description' : string,
  'createdTime' : bigint,
  'isActive' : boolean,
}
export interface Status_v2 {
  'offerTimestamp' : bigint,
  'owner' : Principal,
  'isForeclosed' : boolean,
  'offerValue' : bigint,
}
export interface TransferEvent {
  'to' : Principal,
  'value' : bigint,
  'from' : Principal,
}
export interface _SERVICE extends CubicBackup {}
