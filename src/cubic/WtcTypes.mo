// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type AccountIdentifier = AccountIdentifier_2;
  public type AccountIdentifier_2 = Text;
  public type AccountIdentifier_3 = AccountIdentifier_2;
  public type Balance = Nat;
  public type BalanceRequest = BalanceRequest_2;
  public type BalanceRequest_2 = { token : TokenIdentifier; user : User };
  public type BalanceResponse = BalanceResponse_2;
  public type BalanceResponse_2 = Result_4;
  public type Balance_2 = Balance;
  public type Callback = shared () -> async ();
  public type CommonError = CommonError_2;
  public type CommonError_2 = {
    #InvalidToken : TokenIdentifier;
    #Other : Text;
  };
  public type Extension = Extension_2;
  public type Extension_2 = Text;
  public type Memo = [Nat8];
  public type Metadata = Metadata_2;
  public type Metadata_2 = {
    #fungible : {
      decimals : Nat8;
      metadata : ?[Nat8];
      name : Text;
      symbol : Text;
    };
    #nonfungible : { metadata : ?[Nat8] };
  };
  public type TransferError = {
    #CannotNotify : AccountIdentifier;
    #InsufficientBalance;
    #InvalidToken : TokenIdentifier;
    #Rejected;
    #Unauthorized : AccountIdentifier;
    #Other : Text;
  };
  public type Result = {
    #ok : Balance;
    #err : TransferError;
  };
  public type Result_2 = { #ok : Balance_2; #err : CommonError };
  public type Result_3 = { #ok : Metadata; #err : CommonError };
  public type Result_4 = { #ok : Balance; #err : CommonError_2 };
  public type SubAccount = SubAccount_2;
  public type SubAccount_2 = [Nat8];
  public type TokenIdentifier = Text;
  public type TokenIdentifier_2 = TokenIdentifier;
  public type TransferRequest = TransferRequest_2;
  public type TransferRequest_2 = {
    to : User;
    fee : Balance;
    token : TokenIdentifier;
    notify : Bool;
    from : User;
    memo : Memo;
    subaccount : ?SubAccount;
    amount : Balance;
  };
  public type TransferResponse = TransferResponse_2;
  public type TransferResponse_2 = Result;
  public type User = { #principal : Principal; #address : AccountIdentifier };
  public type User_2 = User;
  public type Self = actor {
    acceptCycles : shared () -> async ();
    actualCycles : shared query () -> async Nat;
    availableCycles : shared query () -> async Nat;
    balance : shared query BalanceRequest -> async BalanceResponse;
    balance_secure : shared BalanceRequest -> async BalanceResponse;
    balances : shared query () -> async [(AccountIdentifier_3, Balance_2)];
    burn : shared (Balance_2, Callback) -> async Bool;
    extensions : shared query () -> async [Extension];
    extensions_secure : shared () -> async [Extension];
    fee : shared query () -> async Balance_2;
    metadata : shared query TokenIdentifier_2 -> async Result_3;
    metadata_secure : shared TokenIdentifier_2 -> async Result_3;
    minCyclesThreshold : shared query () -> async Balance_2;
    mint : shared ?User_2 -> async ();
    supply : shared query TokenIdentifier_2 -> async Result_2;
    supply_secure : shared TokenIdentifier_2 -> async Result_2;
    transfer : shared TransferRequest -> async TransferResponse;
  }
}
