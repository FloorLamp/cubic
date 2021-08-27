import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";

import Wtc "./WtcTypes";
import Xtc "./XtcTypes";

module {
  public type Transfer = {
    from: Principal;
    to: Principal;
    timestamp: Int;
    value: Nat;
  };

  public type Block_pre = {
    id: Nat;
    owner: Principal;
    totalOwnedTime: Int;
    totalValue: Nat;
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

  public type Initialization = {
    controller: Principal;
    defaultValue: Nat;
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
      ownerCount: Nat;
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
};
