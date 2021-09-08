export const idlFactory = ({ IDL }) => {
  const PrincipalToNatEntry = IDL.Tuple(IDL.Principal, IDL.Nat);
  const Status_v2 = IDL.Record({
    'offerTimestamp' : IDL.Int,
    'owner' : IDL.Principal,
    'isForeclosed' : IDL.Bool,
    'offerValue' : IDL.Nat,
  });
  const Block = IDL.Record({
    'id' : IDL.Nat,
    'totalSaleCount' : IDL.Nat,
    'totalValue' : IDL.Nat,
    'owner' : IDL.Principal,
    'lastPurchasePrice' : IDL.Int,
    'lastSaleTime' : IDL.Int,
    'lastSalePrice' : IDL.Int,
    'totalOwnedTime' : IDL.Int,
  });
  const TransferEvent = IDL.Record({
    'to' : IDL.Principal,
    'value' : IDL.Nat,
    'from' : IDL.Principal,
  });
  const PriceChange = IDL.Record({
    'to' : IDL.Nat,
    'owner' : IDL.Principal,
    'from' : IDL.Nat,
  });
  const Event = IDL.Record({
    'id' : IDL.Nat,
    'data' : IDL.Variant({
      'Transfer' : TransferEvent,
      'PriceChange' : PriceChange,
    }),
    'timestamp' : IDL.Int,
  });
  const ProjectDetails_v2 = IDL.Record({
    'creator' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'createdTime' : IDL.Int,
    'isActive' : IDL.Bool,
  });
  const DataEntry_shared = IDL.Record({
    'status' : Status_v2,
    'owners' : IDL.Vec(Block),
    'ownerIdEntries' : IDL.Vec(PrincipalToNatEntry),
    'projectId' : IDL.Nat,
    'events' : IDL.Vec(Event),
    'details' : ProjectDetails_v2,
  });
  const Backup = IDL.Record({
    'foreclosureCount' : IDL.Nat,
    'wtcBalance' : IDL.Nat,
    'ledgerEntries' : IDL.Vec(PrincipalToNatEntry),
    'feesCollected' : IDL.Nat,
    'lastTaxTimestamp' : IDL.Int,
    'salesTotal' : IDL.Nat,
    'cubesSupply' : IDL.Nat,
    'dataEntries' : IDL.Vec(DataEntry_shared),
    'xtcBalance' : IDL.Nat,
    'taxCollected' : IDL.Nat,
  });
  const CubicBackup = IDL.Service({
    'get' : IDL.Func([], [Backup], []),
    'load' : IDL.Func([Backup], [], []),
  });
  return CubicBackup;
};
export const init = ({ IDL }) => { return []; };
