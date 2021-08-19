// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type BurnError = {
    #InsufficientBalance;
    #InvalidTokenContract;
    #NotSufficientLiquidity;
  };
  public type BurnResult = { #Ok : TransactionId; #Err : BurnError };
  public type CreateResult = { #Ok : { canister_id : Principal }; #Err : Text };
  public type Event = {
    fee : Nat64;
    kind : EventDetail;
    cycles : Nat64;
    timestamp : Nat64;
  };
  public type EventDetail = {
    #Burn : { to : Principal; from : Principal };
    #Mint : { to : Principal };
    #CanisterCreated : { from : Principal; canister : Principal };
    #CanisterCalled : {
      from : Principal;
      method_name : Text;
      canister : Principal;
    };
    #Transfer : { to : Principal; from : Principal };
  };
  public type EventsConnection = {
    data : [Event];
    next_canister_id : ?Principal;
  };
  public type MintError = { #NotSufficientLiquidity };
  public type MintResult = { #Ok : TransactionId; #Err : MintError };
  public type ResultCall = { #Ok : { return_ : [Nat8] }; #Err : Text };
  public type ResultSend = { #Ok; #Err : Text };
  public type Stats = {
    transfers_count : Nat64;
    balance : Nat64;
    mints_count : Nat64;
    canisters_created_count : Nat64;
    supply : Nat;
    burns_count : Nat64;
    proxy_calls_count : Nat64;
    history_events : Nat64;
  };
  public type TokenMetaData = {
    features : [Text];
    name : Text;
    decimal : Nat8;
    symbol : Text;
  };
  public type TransactionId = Nat64;
  public type TransferError = {
    #CallFailed;
    #InsufficientBalance;
    #Unknown;
    #AmountTooLarge;
  };
  public type TransferResponse = { #Ok : TransactionId; #Err : TransferError };
  public type Self = actor {
    balance : shared ?Principal -> async Nat64;
    burn : shared {
        canister_id : Principal;
        amount : Nat64;
      } -> async BurnResult;
    events : shared query {
        from : ?Nat64;
        limit : Nat16;
      } -> async EventsConnection;
    get_transaction : shared TransactionId -> async ?Event;
    halt : shared () -> async ();
    meta : shared query () -> async TokenMetaData;
    meta_certified : shared () -> async TokenMetaData;
    mint : shared ?Principal -> async MintResult;
    name : shared query () -> async ?Text;
    stats : shared query () -> async Stats;
    transfer : shared {
        to : Principal;
        amount : Nat64;
      } -> async TransferResponse;
    wallet_balance : shared query () -> async { amount : Nat64 };
    wallet_call : shared {
        args : [Nat8];
        cycles : Nat64;
        method_name : Text;
        canister : Principal;
      } -> async ResultCall;
    wallet_create_canister : shared {
        controller : ?Principal;
        cycles : Nat64;
      } -> async CreateResult;
    wallet_create_wallet : shared {
        controller : ?Principal;
        cycles : Nat64;
      } -> async CreateResult;
    wallet_send : shared {
        canister : Principal;
        amount : Nat64;
      } -> async ResultSend;
  }
}
