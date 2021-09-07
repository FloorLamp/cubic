import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";

import Wtc "./WtcTypes";
import Xtc "./XtcTypes";

module {
  public type Data = {
    projectId: Nat;
    details: ProjectDetails_v2;
    owners: [var Block];
    status: Status_v2;
    ownerIds: PrincipalToNat;
    transfers: [Transfer];
  };

  public type ProjectDetails_v2 = {
    name: Text;
    description: Text;
    creator: Text;
    createdTime: Int;
    isActive: Bool;
  };
  public type SetDetailsRequest = {
    projectId: Nat;
    isActive: ?Bool;
    name: ?Text;
    description: ?Text;
    creator: ?Text;
    createdTime: ?Int;
  };

  public type DataEntry_shared = {
    projectId: Nat;
    details: ProjectDetails_v2;
    owners: [Block];
    status: Status_v2;
    ownerIdEntries: [PrincipalToNatEntry];
    transfers: [Transfer];
  };
  public type DataEntry_v3 = {
    projectId: Nat;
    details: ProjectDetails_v2;
    owners: [var Block];
    status: Status_v2;
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
    projectId: Nat;
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
    projectId: Nat;
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
  public type Status_v2 = {
    isForeclosed: Bool;
    owner: Principal;
    offerTimestamp: Int;
    offerValue: Nat;
  };

  public type Summary = {
    status: Status_v2;
    details: ProjectDetails_v2;
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
    projectCount: Nat;
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
      salesTotal: Nat;
      transactionFee: Nat;
      annualTaxRate: Nat;
      lastTaxTimestamp: Int;
    };
    canisters: Canisters;
    controllers: [Principal];
  };

  public type Error = {
    #CannotPurchase;
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
