export const idlFactory = ({ IDL }) => {
  const PrincipalToNatEntry = IDL.Tuple(IDL.Principal, IDL.Nat);
  const Status = IDL.Record({
    'offerTimestamp' : IDL.Int,
    'owner' : IDL.Principal,
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
  const Transfer = IDL.Record({
    'id' : IDL.Nat,
    'to' : IDL.Principal,
    'value' : IDL.Nat,
    'from' : IDL.Principal,
    'timestamp' : IDL.Int,
  });
  const ProjectDetails = IDL.Record({
    'creator' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'createdTime' : IDL.Int,
  });
  const DataEntry_shared = IDL.Record({
    'status' : Status,
    'owners' : IDL.Vec(Block),
    'transfers' : IDL.Vec(Transfer),
    'ownerIdEntries' : IDL.Vec(PrincipalToNatEntry),
    'projectId' : IDL.Nat,
    'details' : ProjectDetails,
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
