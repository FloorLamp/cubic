import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import T "./Types";
import Time "mo:base/Time";
import Wtc "./WtcTypes";
import Xtc "./XtcTypes";

shared actor class Cubic(init: T.Initialization) = this {
  var ownerIds: T.PrincipalToNat = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  stable var ownerIdEntries: [T.PrincipalToNatEntry] = [];

  var ledger: T.PrincipalToNat = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  stable var ledgerEntries: [T.PrincipalToNatEntry] = [];

  stable var history: [T.Transfer] = [];

  stable var blocks: [var T.Block] = [var];
  stable var status: T.Status = {
    owner = Principal.fromText("aaaaa-aa");
    offerTimestamp = Time.now();
    offerValue = init.defaultValue;
  };

  // ---- Stats
  stable var cubesSupply: Nat = 0;
  stable var wtcBalance: Nat = 0;
  stable var xtcBalance: Nat = 0;
  stable var salesTotal: Nat = 0;
  stable var lastTaxTimestamp: Int = 0;
  stable var taxCollected: Nat = 0;
  stable var feesCollected: Nat = 0;
  stable var foreclosureCount: Nat = 0;

  stable var controller: Principal = init.controller;
  stable var canisters: T.Canisters = init.canisters;

  let wtc = actor (Principal.toText(canisters.wtc)) : Wtc.Self;
  let xtc = actor (Principal.toText(canisters.xtc)) : Xtc.Self;

  // ---- Economic parameters

  let TC = 1_000_000_000_000;
  let minimumCycleBalance = TC / 2; // maintain 0.5TC in canister
  let maximumCycleBalance = TC * 100; // wrap anything over 100TC

  // fees are in percent times 1e8, ie. 100% = 1e8
  stable var TRANSACTION_FEE = 1_000_000; // 1%
  stable var ANNUAL_TAX_RATE = 5_000_000; // 5%
  stable var FORECLOSURE_PRICE = 1 * TC; // 1 TC


  // ---- Getters

  public query func info(): async T.Info {
    {
      stats = {
        wtcBalance = wtcBalance;
        xtcBalance = xtcBalance;
        cyclesBalance = Cycles.balance();
        cubesSupply = cubesSupply;
        ownCubesBalance = Option.get(ledger.get(thisPrincipal()), 0);
        feesCollected = feesCollected;
        taxCollected = taxCollected;
        transactionsCount = history.size();
        foreclosureCount = foreclosureCount;
        ownerCount = ownerIdEntries.size();
        salesTotal = salesTotal;
        transactionFee = TRANSACTION_FEE;
        annualTaxRate = ANNUAL_TAX_RATE;
        lastTaxTimestamp = lastTaxTimestamp;
      };
      canisters = canisters;
    }
  };

  public query func art(): async [T.Block] {
    latestBlocks()
  };

  /* Return 100 sorted blocks, no pagination */
  public query func getBlocks(request: T.BlocksRequest): async [T.Block] {
    let data = latestBlocks();

    let sorted = switch (request.orderBy, request.order) {
      case (#id, #asc) { data };
      case (#id, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.id > a.id) { #greater } else { #less }
      }) };
      case (#totalOwnedTime, #asc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.totalOwnedTime < a.totalOwnedTime) { #greater } else { #less }
      }) };
      case (#totalOwnedTime, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.totalOwnedTime > a.totalOwnedTime) { #greater } else { #less }
      }) };
      case (#totalValue, #asc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.totalValue < a.totalValue) { #greater } else { #less }
      }) };
      case (#totalValue, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.totalValue > a.totalValue) { #greater } else { #less }
      }) };
    };

    Array.tabulate<T.Block>(Nat.min(100, sorted.size()), func (i) {
      sorted[i]
    });
  };

  public query func getStatus(): async (T.Status, ?T.Block) {
    (status,
    switch (ownerIds.get(status.owner)) {
      case (?id) { ?blockWithTimeNow(blocks[id]); };
      case _ { null };
    })
  };

  public query func getHistory(): async [T.Transfer] {
    history
  };

  public query({ caller }) func balance(user_: ?Principal) : async Nat {
    let user = Option.get(user_, caller);
    Option.get(ledger.get(user), 0)
  };


  // ---- Updates

  // Deposit XTC
  public shared({ caller }) func depositXtc(owner: Principal) : async Nat {
    assert(caller == canisters.xtc);

    let amount = Cycles.available();
    let accepted = Cycles.accept(amount);
    assert(accepted > 0);
    ledger.put(owner, Option.get(ledger.get(owner), 0) + accepted);
    cubesSupply := cubesSupply + accepted;
    let balance = Cycles.balance();
    if (balance > maximumCycleBalance) {
      let diff = balance - maximumCycleBalance;
      Cycles.add(diff);
      switch (await xtc.mint(null)) {
        case (#Err(error)) {
          Debug.print("minting XTC failed: " # debug_show(error));
        };
        case _ {
          xtcBalance := Nat64.toNat(await xtc.balance(null));
        }
      };
    };
    accepted;
  };

  // Deposit WTC
  public shared({ caller }) func tokenTransferNotification(tokenId: Wtc.TokenIdentifier, user: Wtc.User, balance: Wtc.Balance, memo: Wtc.Memo): async ?Wtc.Balance {
    assert(caller == canisters.wtc);

    Debug.print(debug_show(tokenId, user, balance, memo));
    switch (tokenId, user) {
      case ("WTC", #principal(owner)) {
        ledger.put(owner, Option.get(ledger.get(owner), 0) + balance);
        wtcBalance := wtcBalance + balance;
        cubesSupply := cubesSupply + balance;
        ?balance;
      };
      case _ {
        null;
      };
    }
  };

  // Deposit raw cycles
  public shared({ caller }) func wallet_receive() : async Nat {
    let amount = Cycles.available();
    let accepted = Cycles.accept(amount);
    assert(accepted > 0);
    ledger.put(caller, Option.get(ledger.get(caller), 0) + accepted);
    cubesSupply := cubesSupply + accepted;
    accepted;
  };

  // Accept raw cycles without issuing cubes
  public shared func acceptCycles() : async () {
    let amount = Cycles.available();
    let accepted = Cycles.accept(amount);
    assert(accepted > 0);
  };

  func _mintXtcUpTo(amount: Nat): async Bool {
    if (xtcBalance >= amount) { return true };

    // Ensure we have an extra 1BC of margin
    let amountWithMargin = amount + TC / 1_000;
    let rawBalance = Cycles.balance() - minimumCycleBalance;
    if (rawBalance + xtcBalance < amountWithMargin) {
      // Not enough liquidity
      if (rawBalance + wtcBalance + xtcBalance < amountWithMargin) {
        return false;
      };

      // burn difference from WTC
      let wtcToBurn = amountWithMargin - xtcBalance - rawBalance;
      if (not (await wtc.burn(wtcToBurn, acceptCycles))) {
        Debug.print("burning WTC for XTC failed");
        return false;
      };

      // Sync WTC balance
      switch (await wtc.balance({ token = "WTC"; user = #principal(thisPrincipal()) })) {
        case (#ok(balance)) {
          wtcBalance := balance;
        };
        case _ {};
      };
    };

    // mint difference to XTC
    Cycles.add(amountWithMargin - xtcBalance);
    switch (await xtc.mint(null)) {
      case (#Err(error)) {
        Debug.print("minting XTC failed: " # debug_show(error));
        false;
      };
      case _ { true }
    };
  };

  func _mintWtcUpTo(amount: Nat): async Bool {
    if (wtcBalance >= amount) { return true };

    // Ensure we have an extra 1BC of margin
    let amountWithMargin = amount + TC / 1_000;
    let rawBalance = Cycles.balance() - minimumCycleBalance;

    if (rawBalance + wtcBalance < amountWithMargin) {
      // Not enough liquidity
      if (rawBalance + wtcBalance + wtcBalance < amountWithMargin) {
        return false;
      };

      // burn difference from XTC
      let xtcToBurn = amountWithMargin - wtcBalance - rawBalance;
      switch (await xtc.burn({ amount = Nat64.fromNat(xtcToBurn); canister_id = thisPrincipal() })) {
        case (#Err(error)) {
          Debug.print("burning XTC for WTC failed: " # debug_show(error));
          return false;
        };
        case _ {}
      };

      // Sync XTC balance
      xtcBalance := Nat64.toNat(await xtc.balance(null));
    };

    // mint difference to WTC
    Cycles.add(amountWithMargin - wtcBalance);
    await wtc.mint(null);
    true
  };

  // Sell cubes for cycles
  public shared({ caller }) func withdraw(request: T.WithdrawRequest): async T.Result {
    let balance = Option.get(ledger.get(caller), 0);

    if (balance < request.amount) {
      return #err(#InsufficientBalance);
    };

    switch (request.asset) {
      case (#WTC) {
        if (not (await _mintWtcUpTo(request.amount))) {
          return #err(#InsufficientLiquidity);
        };

        try {
          switch (await wtc.transfer({
            from = #principal(thisPrincipal());
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
              ledger.put(caller, balance - accepted);

              // Sync WTC balance
              switch (await wtc.balance({ token = "WTC"; user = #principal(thisPrincipal()) })) {
                case (#ok(balance)) {
                  wtcBalance := balance;
                };
                case _ {};
              };

              #ok
            };
            case (#err(transferError)) { #err(#WtcTransferError(transferError)) }
          };


        } catch (error) {
          #err(makeError(error))
        }
      };
      case (#XTC) {
        if (not (await _mintXtcUpTo(request.amount))) {
          return #err(#InsufficientLiquidity);
        };

        try {
          switch (await xtc.transfer({
            to = caller;
            amount = Nat64.fromNat(request.amount);
          })) {
            case (#Ok(_)) {
              cubesSupply := cubesSupply - request.amount;
              ledger.put(caller, balance - request.amount);

              // Sync XTC balance
              xtcBalance := Nat64.toNat(await xtc.balance(null));

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

    let now = Time.now();

    if (lastTaxTimestamp == 0 or status.owner == thisPrincipal()) {
      // First sale or foreclosed, no tax needed
      lastTaxTimestamp := now;
    } else {
      // Assess taxes before sale. Foreclosure can happen here!
      ignore _tax();
    };

    // Debit the buyer
    ledger.put(caller, buyerBalance - status.offerValue);

    // Subtract fees, which will remain in Cubic
    let txFee = percentOf(status.offerValue, TRANSACTION_FEE);
    Debug.print(debug_show(status.offerValue, txFee));
    assert(txFee <= status.offerValue);
    feesCollected := feesCollected + txFee;

    // Credit the seller
    let amountMinusFees = status.offerValue - txFee;
    ledger.put(status.owner, Option.get(ledger.get(status.owner), 0) + amountMinusFees);

    // Add transfer to history
    history := Array.append(history, [{
      from = status.owner;
      to = caller;
      timestamp = now;
      value = status.offerValue;
    }]);
    salesTotal := salesTotal + status.offerValue;

    // Finalize previous owner's block
    switch (ownerIds.get(status.owner)) {
      case (?prevId) {
        blocks[prevId] := {
          id = blocks[prevId].id;
          owner = blocks[prevId].owner;
          totalOwnedTime = blocks[prevId].totalOwnedTime + now - status.offerTimestamp;
          totalValue = blocks[prevId].totalValue + status.offerValue;
        };
      };
      case _ {}
    };

    // Add new owner block if needed
    switch (ownerIds.get(caller)) {
      case (?id) {};
      case null {
        let newId = blocks.size();
        ownerIds.put(caller, newId);
        blocks := Array.thaw(Array.append(Array.freeze(blocks), [{
          id = newId;
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

  // Run periodic events, eg. tax
  public shared func canister_heartbeat(): async () {
    ignore _tax();
    ignore _refill();
  };

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

  /*
    Harberger tax:
    Tax the current owner based on the current offer price and tax rate.
    If owner does not have sufficient cubes balance to pay, the asset will be foreclosed.

    Foreclosure:
    - Owner accrues owned time, but not value
    - Ownership transfers to this canister
    - Offer price is set to 0
  */
  func _tax(): Nat {
    if (lastTaxTimestamp == 0 or status.owner == thisPrincipal()) { return 0 };

    let now = Time.now();
    let seconds = Int.abs(now - lastTaxTimestamp) / 1_000_000_000;
    let amount = percentOf(seconds * status.offerValue, ANNUAL_TAX_RATE) / 365 / 24 / 60 / 60;
    Debug.print(debug_show(seconds, status.offerValue, amount));

    if (amount > 0) {
      let ownerBalance = Option.get(ledger.get(status.owner), 0);
      let deductible = Nat.min(ownerBalance, amount);

      // Transfer deductible from owner to self
      taxCollected := taxCollected + deductible;
      ledger.put(thisPrincipal(), Option.get(ledger.get(thisPrincipal()), 0) + deductible);
      ledger.put(status.owner, ownerBalance - deductible);

      // Owner cannot pay full tax: Foreclose
      if (ownerBalance < amount) {
        foreclosureCount := foreclosureCount + 1;

        // Transfer to self with 0-value
        history := Array.append(history, [{
          from = status.owner;
          to = thisPrincipal();
          timestamp = now;
          value = 0;
        }]);

        // Owner increases owned time but not value
        let ownerId = Option.unwrap(ownerIds.get(status.owner));
        blocks[ownerId] := blockWithTimeNow(blocks[ownerId]);

        // New offer is 0-value
        status := {
          owner = thisPrincipal();
          offerTimestamp = now;
          offerValue = FORECLOSURE_PRICE;
        };
      };
    };

    // Updated tax timestamp
    lastTaxTimestamp := now;

    amount
  };

  /*
    Ensure that we have at least 1TC in raw cycles by unwrapping
  */
  func _refill(): async () {
    if (Cycles.balance() < minimumCycleBalance) {
      let available = Option.get(ledger.get(thisPrincipal()), 0);
      if (available == 0) {
        Debug.print("no cubes balance, cannot refill");
        return;
      };

      let wtcBalance = switch (await wtc.balance({ token = "WTC"; user = #principal(thisPrincipal()) })) {
        case (#ok(balance)) { balance };
        case _ { 0 };
      };
      let xtcBalance = Nat64.toNat(await xtc.balance(null));
      if (wtcBalance == 0 and xtcBalance == 0) {
        Debug.print("no WTC or XTC balance to refill from!");
        return
      };
      if (wtcBalance > xtcBalance) {
        let amount = Nat.min(TC, wtcBalance);
        Debug.print("refilling from WTC, balance: " # debug_show(wtcBalance) # ", amount: " # debug_show(amount));
        if (not (await wtc.burn(amount, acceptCycles))) {
          Debug.print("refilling from WTC failed!");
        }
      } else {
        let amount = Nat.min(TC, xtcBalance);
        Debug.print("refilling from XTC, balance: " # debug_show(xtcBalance));
        switch (await xtc.burn({ amount = Nat64.fromNat(amount); canister_id = thisPrincipal() })) {
          case (#Err(error)) {
            Debug.print("refilling from XTC failed: " # debug_show(error));
          };
          case _ {}
        }
      }
    }
  };


  // ---- Helpers

  func blockWithTimeNow(block: T.Block): T.Block {
    {
      id = block.id;
      owner = block.owner;
      totalOwnedTime = block.totalOwnedTime + (Time.now() - status.offerTimestamp);
      totalValue = block.totalValue;
    }
  };

  func latestBlocks(): [T.Block] {
    Array.map<T.Block, T.Block>(Array.freeze(blocks), func (block) {
      if (block.owner == status.owner) {
        blockWithTimeNow(block)
      } else {
        block
      }
    })
  };

  func thisPrincipal(): Principal { Principal.fromActor(this) };

  func percentOf(amount: Nat, fee: Nat): Nat {
    amount * fee / 100_000_000;
  };

  func makeError(e: Error): T.Error {
    #Error({
      error_message = Error.message(e);
      error_type = Error.code(e);
    })
  };
};
