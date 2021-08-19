import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

import Wtc "./WtcTypes";
import Xtc "./XtcTypes";
import T "./Types";

shared actor class Cubic(init: T.Initialization) = this {
  var ownerIds: T.PrincipalToNat = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  stable var ownerIdEntries: [T.PrincipalToNatEntry] = [];

  var ledger: T.PrincipalToNat = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  stable var ledgerEntries: [T.PrincipalToNatEntry] = [];
  stable var cubesSupply: Nat = 0;

  stable var history: [T.Transfer] = [];
  stable var salesTotal: Nat = 0;

  stable var blocks: [var T.Block] = [var];
  stable var status: T.Status = {
    owner = init.controller;
    offerTimestamp = Time.now();
    offerValue = init.defaultValue;
  };

  stable var controller: Principal = init.controller;
  stable var canisters: T.Canisters = init.canisters;

  let wtc = actor (Principal.toText(canisters.wtc)) : Wtc.Self;
  let xtc = actor (Principal.toText(canisters.xtc)) : Xtc.Self;

  public shared func info(): async T.Info {
    {
      stats = {
        wtcBalance = await wtc.balance({ token = "WTC"; user = #principal(Principal.fromActor(this)) });
        xtcBalance = await xtc.balance(null);
        cyclesBalance = Cycles.balance();
        cubesSupply = cubesSupply;
        feesCollected = Option.get(ledger.get(Principal.fromActor(this)), 0);
        transactionsCount = history.size();
        ownerCount = ownerIdEntries.size();
        salesTotal = salesTotal;
      };
      canisters = canisters;
    }
  };

  public query func art(): async [T.Block] {
    Array.map<T.Block, T.Block>(Array.freeze(blocks), func (block) {
      if (block.owner == status.owner) {
        {
          owner = block.owner;
          totalOwnedTime = block.totalOwnedTime + (Time.now() - status.offerTimestamp);
          totalValue = block.totalValue;
        }
      } else {
        block
      }
    })
  };

  public query func getStatus(): async T.Status {
    status
  };

  public query func getHistory(): async [T.Transfer] {
    history
  };

  public query({ caller }) func getBalance() : async Nat {
    Option.get(ledger.get(caller), 0)
  };

  // ---- Updates

  // Mint cubes
  public shared({ caller }) func mint(amount: Nat) : async () {
    ledger.put(caller, Option.get(ledger.get(caller), 0) + amount);
    cubesSupply := cubesSupply + amount;
  };

  // Wtc
  public shared({ caller }) func tokenTransferNotification(tokenId: Wtc.TokenIdentifier, user: Wtc.User, balance: Wtc.Balance, memo: Wtc.Memo): async ?Wtc.Balance {
    assert(caller == canisters.wtc);

    Debug.print(debug_show(tokenId, user, balance, memo));
    switch (tokenId, user) {
      case ("WTC", #principal(owner)) {
        ledger.put(owner, Option.get(ledger.get(owner), 0) + balance);
        cubesSupply := cubesSupply + balance;
        ?balance;
      };
      case _ {
        null;
      };
    }
  };

  // Accept raw cycles
  public shared({ caller }) func wallet_receive() : async Nat {
    let amount = Cycles.available();
    let accepted = Cycles.accept(amount);
    assert(accepted > 0);
    ledger.put(caller, Option.get(ledger.get(caller), 0) + accepted);
    cubesSupply := cubesSupply + accepted;
    accepted;
  };

  // Sell cubes for cycles
  public shared({ caller }) func withdraw(request: T.WithdrawRequest): async T.Result {
    let balance = Option.get(ledger.get(caller), 0);

    if (balance < request.amount) {
      return #err(#InsufficientBalance);
    };

    ledger.put(caller, balance - request.amount);
    switch (request.asset) {
      case (#WTC) {
        try {
          switch (await wtc.transfer({
            from = #principal(Principal.fromActor(this));
            to = #principal(caller);
            amount = request.amount;
            fee = 0;
            token = "WTC";
            memo = [];
            notify = false;
            subaccount = null;
          })) {
            case (#ok(accepted)) {
              cubesSupply := cubesSupply - accepted;
              #ok
            };
            case (#err(transferError)) { #err(#WtcTransferError(transferError)) }
          }
        } catch (error) {
          #err(makeError(error))
        }
      };
      case (#XTC) {
        try {
          switch (await xtc.transfer({
            to = caller;
            amount = Nat64.fromNat(request.amount);
          })) {
            case (#Ok(_)) {
              cubesSupply := cubesSupply - request.amount;
              #ok
            };
            case (#Err(transferError)) { #err(#XtcTransferError(transferError)) }
          }
        } catch (error) {
          #err(makeError(error))
        }
      };
    };
  };

  // Transfer ownership to buyer and update the offer
  public shared({ caller }) func buy(newOffer: Nat): async T.Result {
    let buyerBalance = Option.get(ledger.get(caller), 0);
    if (buyerBalance < status.offerValue) {
      return #err(#InsufficientBalance);
    };

    // Debit the buyer
    ledger.put(caller, buyerBalance - status.offerValue);

    // Subtract fees, which will remain in Cubic
    let serviceFee = calculateServiceFee(status.offerValue);
    Debug.print(debug_show(status.offerValue, serviceFee));

    // Credit the seller
    let amountMinusFees = status.offerValue - serviceFee;
    ledger.put(status.owner, Option.get(ledger.get(status.owner), 0) + amountMinusFees);

    let now = Time.now();

    // Add transfer to history
    history := Array.append(history, [{
      from = status.owner;
      to = caller;
      timestamp = now;
      value = status.offerValue;
    }]);
    salesTotal := salesTotal + status.offerValue;

    // Finalize previous owner's cube
    switch (ownerIds.get(status.owner)) {
      case (?prevId) {
        blocks[prevId] := {
          owner = blocks[prevId].owner;
          totalOwnedTime = now - status.offerTimestamp;
          totalValue = blocks[prevId].totalValue + status.offerValue;
        };
      };
      case _ {
        // No previous owner, this purchase is the first!
      }
    };

    // Add or update new owner cube
    switch (ownerIds.get(caller)) {
      case (?id) {
        blocks[id] := {
          owner = blocks[id].owner;
          totalOwnedTime = blocks[id].totalOwnedTime;
          totalValue = blocks[id].totalValue;
        };
      };
      case _ {
        ownerIds.put(caller, blocks.size());
        blocks := Array.thaw(Array.append(Array.freeze(blocks), [{
          owner = caller;
          totalOwnedTime = 0;
          totalValue = 0;
        }]));
      }
    };

    // Set new status
    status := {
      owner = caller;
      offerTimestamp = now;
      offerValue = newOffer;
    };

    #ok
  };


  // ---- Controller functions

  public shared({ caller }) func setCanisters(newCanisters: T.Canisters): async () {
    assert(caller == controller);
    canisters := newCanisters;
  };


  // ---- System functions

  system func preupgrade() {
    ownerIdEntries := Iter.toArray(ownerIds.entries());
    ledgerEntries := Array.filter<T.PrincipalToNatEntry>(Iter.toArray(ledger.entries()), func ((_, bal)) {
      bal > 0
    });
  };

  system func postupgrade() {
    ownerIds := HashMap.fromIter<Principal, Nat>(ownerIdEntries.vals(), ownerIdEntries.size(), Principal.equal, Principal.hash);
    ledger := HashMap.fromIter<Principal, Nat>(ledgerEntries.vals(), ledgerEntries.size(), Principal.equal, Principal.hash);
    cubesSupply := Array.foldLeft<T.PrincipalToNatEntry, Nat>(ledgerEntries, 0, func (sum, (_, bal)) {
      sum + bal
    });
    salesTotal := Array.foldLeft<T.Transfer, Nat>(history, 0, func (sum, ({value})) {
      sum + value
    });
  };

  // ---- Private functions

  stable var SERVICE_FEE = 1_000_000; // percent times 1e8, ie. 100% = 1e8
  func calculateServiceFee(amount: Nat): Nat {
    amount * SERVICE_FEE / 100_000_000;
  };

  func makeError(e: Error): T.Error {
    #Error({
      error_message = Error.message(e);
      error_type = Error.code(e);
    })
  };
};
