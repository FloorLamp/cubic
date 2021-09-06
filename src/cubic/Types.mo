import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";

import Wtc "./WtcTypes";
import Xtc "./XtcTypes";

module {
  public type Data = {
    artId: Nat;
    details: ArtDetails;
    owners: [var Block];
    status: Status;
    ownerIds: PrincipalToNat;
    transfers: [Transfer];
  };

  public type ArtDetails = {
    name: Text;
    description: Text;
    creator: Text;
    createdTime: Int;
  };
  public type SetDetailsRequest = {
    artId: Nat;
    name: ?Text;
    description: ?Text;
    creator: ?Text;
    createdTime: ?Int;
  };

  public type DataEntry_shared = {
    artId: Nat;
    details: ArtDetails;
    owners: [Block];
    status: Status;
    ownerIdEntries: [PrincipalToNatEntry];
    transfers: [Transfer];
  };
  public type DataEntry_post = {
    artId: Nat;
    details: ArtDetails;
    owners: [var Block];
    status: Status;
    ownerIdEntries: [PrincipalToNatEntry];
    transfers: [Transfer];
  };

  public type Transfer = {
    id: Nat;
    from: Principal;
    to: Principal;
    timestamp: Int;
    value: Nat;
  };

  public type HistoryRequest = {
    artId: Nat;
    principal: ?Principal;
  };

  public type HistoryResponse = {
    transfers: [Transfer];
    count: Nat;
  };

  public type Block = {
    id: Nat;
    owner: Principal;
    lastPurchasePrice: Int;
    lastSalePrice: Int;
    lastSaleTime: Int;
    totalOwnedTime: Int;
    totalSaleCount: Nat;
    totalValue: Nat;
  };

  public type BlocksRequest = {
    artId: Nat;
    orderBy: {
      #id;
      #lastPurchasePrice;
      #lastSalePrice;
      #lastSaleTime;
      #totalSaleCount;
      #totalOwnedTime;
      #totalValue;
    };
    order: { #asc; #desc };
  };

  public type Status = {
    owner: Principal;
    offerTimestamp: Int;
    offerValue: Nat;
  };

  public type StatusAndOwner = {
    status: Status;
    owner: ?Block;
  };

  public type Initialization = {
    controller: Principal;
    canisters: Canisters;
  };

  public type Canisters = {
    wtc: Principal;
    xtc: Principal;
  };

  public type WithdrawRequest = {
    amount: Nat;
    asset: {
      #WTC;
      #XTC;
    };
  };

  public type PrincipalToNatEntry = (Principal, Nat);
  public type PrincipalToNat = HashMap.HashMap<Principal, Nat>;

  public type Info = {
    arts: Nat;
    stats: {
      wtcBalance: Nat;
      xtcBalance: Nat;
      cyclesBalance: Nat;
      cubesSupply: Nat;
      ownCubesBalance: Nat;
      feesCollected: Nat;
      taxCollected: Nat;
      transactionsCount: Nat;
      foreclosureCount: Nat;
      // ownerCount: Nat;
      salesTotal: Nat;
      transactionFee: Nat;
      annualTaxRate: Nat;
      lastTaxTimestamp: Int;
    };
    canisters: Canisters;
  };

  public type Error = {
    #InsufficientBalance;
    #InsufficientLiquidity;
    #WtcTransferError: Wtc.TransferError;
    #XtcTransferError: Xtc.TransferError;
    #Error: { error_message : Text; error_type : Error.ErrorCode };
  };

  public type Result = Result.Result<(), Error>;

  public type BackupService = actor {
    get : shared () -> async Backup;
    load : shared Backup -> async ();
  };

  public type Backup = {
    ledgerEntries: [PrincipalToNatEntry];
    dataEntries: [DataEntry_shared];
    cubesSupply: Nat;
    wtcBalance: Nat;
    xtcBalance: Nat;
    salesTotal: Nat;
    lastTaxTimestamp: Int;
    taxCollected: Nat;
    feesCollected: Nat;
    foreclosureCount: Nat;
  };
};
