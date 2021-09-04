import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Http "./Http";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";

import Svg000 "./Svg/000";
import T "./Types";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Wtc "./WtcTypes";
import Xtc "./XtcTypes";

shared actor class Cubic(init: T.Initialization) = this {
  // ---- Global state
  var ledger: T.PrincipalToNat = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  stable var ledgerEntries: [T.PrincipalToNatEntry] = [];

  var data: [var T.Data] = [var];
  stable var dataEntries: [T.DataEntry] = [];

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
  let backup : T.BackupService = actor "b6e3n-dqaaa-aaaah-aaqyq-cai";

  // ---- Economic parameters

  let TC = 1_000_000_000_000;
  let minimumCycleBalance = TC / 2; // maintain 0.5TC in canister
  let maximumCycleBalance = TC * 100; // wrap anything over 100TC

  // fees are in percent times 1e8, ie. 100% = 1e8
  stable var TRANSACTION_FEE = 1_000_000; // 1%
  stable var ANNUAL_TAX_RATE = 5_000_000; // 5%
  stable var FORECLOSURE_PRICE = 1 * TC; // 1 TC

  // ---- Backups
  let BACKUP_INTERVAL = 30 * 60 * 1_000_000_000; // store backups every 30 min
  stable var lastBackupTime = 0;


  // ---- Getters

  public query func info(): async T.Info {
    {
      arts = data.size();
      stats = {
        wtcBalance = wtcBalance;
        xtcBalance = xtcBalance;
        cyclesBalance = Cycles.balance();
        cubesSupply = cubesSupply;
        ownCubesBalance = Option.get(ledger.get(thisPrincipal()), 0);
        feesCollected = feesCollected;
        taxCollected = taxCollected;
        transactionsCount = Array.foldLeft<T.Data, Nat>(Array.freeze(data), 0, func (sum, ({transfers})) {
          sum + transfers.size()
        });
        foreclosureCount = foreclosureCount;
        salesTotal = salesTotal;
        transactionFee = TRANSACTION_FEE;
        annualTaxRate = ANNUAL_TAX_RATE;
        lastTaxTimestamp = lastTaxTimestamp;
      };
      canisters = canisters;
    }
  };

  public query func art(artId: Nat): async [T.Block] {
    latestBlocks(artId)
  };

  public query func http_request(req: Http.HttpRequest): async (Http.HttpResponse) {
    let path = Http.removeQuery(req.url);

    switch (path) {
      case ("/000.svg") { Http.svg(Svg000.make(latestBlocks(0))) };
      case _ {
        {
          body = Text.encodeUtf8("404 Not found :" # path);
          headers = [];
          status_code = 404;
          streaming_strategy = null;
        };
      }
    };
  };

  /* Return 100 sorted blocks, no pagination */
  public query func getBlocks(request: T.BlocksRequest): async [T.Block] {
    let data = latestBlocks(request.artId);

    let sorted = switch (request.orderBy, request.order) {
      case (#id, #asc) { data };
      case (#id, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.id > a.id) { #greater } else { #less }
      }) };
      case (#lastPurchasePrice, #asc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.lastPurchasePrice < a.lastPurchasePrice) { #greater } else { #less }
      }) };
      case (#lastPurchasePrice, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.lastPurchasePrice > a.lastPurchasePrice) { #greater } else { #less }
      }) };
      case (#lastSalePrice, #asc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.lastSalePrice < a.lastSalePrice) { #greater } else { #less }
      }) };
      case (#lastSalePrice, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.lastSalePrice > a.lastSalePrice) { #greater } else { #less }
      }) };
      case (#lastSaleTime, #asc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.lastSaleTime < a.lastSaleTime) { #greater } else { #less }
      }) };
      case (#lastSaleTime, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.lastSaleTime > a.lastSaleTime) { #greater } else { #less }
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
      case (#totalSaleCount, #asc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.totalSaleCount < a.totalSaleCount) { #greater } else { #less }
      }) };
      case (#totalSaleCount, #desc) { Array.sort<T.Block>(data, func(a, b) {
        if (b.totalSaleCount > a.totalSaleCount) { #greater } else { #less }
      }) };
    };

    Array.tabulate<T.Block>(Nat.min(100, sorted.size()), func (i) {
      sorted[i]
    });
  };

  public query func getStatus(artId: Nat): async T.StatusAndOwner {
    let {status; ownerIds; owners} = data[artId];

    {
      status = status;
      owner = switch (ownerIds.get(status.owner)) {
        case (?id) { ?blockWithTimeNow(owners[id], status); };
        case _ { null };
      };
    }
  };

  public query func getAllStatus(): async [T.StatusAndOwner] {
    Array.map<T.Data, T.StatusAndOwner>(Array.freeze(data), func (d) {
      let {status; ownerIds; owners} = d;

      {
        status = status;
        owner = switch (ownerIds.get(status.owner)) {
          case (?id) { ?blockWithTimeNow(owners[id], status); };
          case _ { null };
        };
      }
    })
  };

  public query func getHistory(request: T.HistoryRequest): async T.HistoryResponse {
    let {transfers} = data[request.artId];

    let (max, filtered) = switch (request.principal) {
      case (?principal) {
        let filtered = Array.filter<T.Transfer>(transfers, func ({ from; to }) {
          from == principal or to == principal
        });
        (filtered.size(), filtered)
      };
      case _ {
        (Nat.min(100, transfers.size()), transfers)
      }
    };

    let size = filtered.size();
    {
      transfers = Array.tabulate<T.Transfer>(max, func (i) {
        filtered[size - i - 1]
      });
      count = transfers.size();
    }
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
      let diff = balance - maximumCycleBalance : Nat;
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

  // Sell cubes for cycles
  public shared({ caller }) func withdraw(request: T.WithdrawRequest): async T.Result {
    let ownerOf = Array.find<T.Data>(Array.freeze(data), func (d) {
      d.status.owner == caller
    });

    if (Option.isSome(ownerOf)) {
      _tax();
    };

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
  public shared({ caller }) func buy(request: {artId: Nat; newOffer: Nat}): async T.Result {
    let {status; ownerIds; owners; transfers} = data[request.artId];

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
      _tax();
    };

    // Debit the buyer
    ledger.put(caller, buyerBalance - status.offerValue);

    // Subtract fees, which will remain in Cubic
    let txFee = percentOf(status.offerValue, TRANSACTION_FEE);
    Debug.print(debug_show(status.offerValue, txFee));
    assert(txFee <= status.offerValue);

    feesCollected := feesCollected + txFee;
    ledger.put(thisPrincipal(), Option.get(ledger.get(thisPrincipal()), 0) + txFee);

    // Credit the seller
    let amountMinusFees = status.offerValue - txFee : Nat;
    ledger.put(status.owner, Option.get(ledger.get(status.owner), 0) + amountMinusFees);

    // Add transfer to history
    let newTransfers = Array.append(transfers, [{
      id = transfers.size();
      artId = request.artId;
      from = status.owner;
      to = caller;
      timestamp = now;
      value = status.offerValue;
    }]);
    salesTotal := salesTotal + status.offerValue;

    // Finalize previous owner's block
    switch (ownerIds.get(status.owner)) {
      case (?prevId) {
        owners[prevId] := {
          id = owners[prevId].id;
          owner = owners[prevId].owner;
          lastPurchasePrice = owners[prevId].lastPurchasePrice;
          lastSalePrice = status.offerValue;
          lastSaleTime = now;
          totalSaleCount = owners[prevId].totalSaleCount + 1;
          totalOwnedTime = owners[prevId].totalOwnedTime + now - status.offerTimestamp;
          totalValue = owners[prevId].totalValue + status.offerValue;
        };
      };
      case _ {}
    };

    // Add new owner if needed
    let newOwners = switch (ownerIds.get(caller)) {
      case (?id) { owners };
      case null {
        let newId = owners.size();
        ownerIds.put(caller, newId);
        Array.thaw<T.Block>(Array.append(Array.freeze(owners), [{
          id = newId;
          owner = caller;
          lastPurchasePrice = status.offerValue;
          lastSalePrice = 0;
          lastSaleTime = 0;
          totalSaleCount = 0;
          totalOwnedTime = 0;
          totalValue = 0;
        }]));
      }
    };

    // Set new status
    let newStatus = {
      owner = caller;
      offerTimestamp = now;
      offerValue = request.newOffer;
    };

    data[request.artId] := {
      artId = request.artId;
      owners = newOwners;
      status = newStatus;
      ownerIds = ownerIds;
      transfers = newTransfers;
    };

    #ok
  };


  // ---- Controller functions

  public shared({ caller }) func setCanisters(newCanisters: T.Canisters): async () {
    assert(caller == controller);
    canisters := newCanisters;
  };

  // Restore from backup canister
  public shared({ caller }) func restore(): async () {
    assert(caller == controller);
    let dump = await backup.get();

    ledger := HashMap.fromIter<Principal, Nat>(dump.ledgerEntries.vals(), dump.ledgerEntries.size(), Principal.equal, Principal.hash);
    data := Array.thaw(Array.map<T.DataEntry_shared, T.Data>(dump.dataEntries, func (d) {
      {
        artId = d.artId;
        owners = Array.thaw(d.owners);
        status = d.status;
        ownerIds = HashMap.fromIter<Principal, Nat>(d.ownerIdEntries.vals(), d.ownerIdEntries.size(), Principal.equal, Principal.hash);
        transfers = d.transfers;
      }
    }));
    cubesSupply := dump.cubesSupply;
    wtcBalance := dump.wtcBalance;
    xtcBalance := dump.xtcBalance;
    salesTotal := dump.salesTotal;
    lastTaxTimestamp := dump.lastTaxTimestamp;
    taxCollected := dump.taxCollected;
    feesCollected := dump.feesCollected;
    foreclosureCount := dump.foreclosureCount;
  };


  // ---- System functions

  // Run periodic events, eg. tax
  public shared func canister_heartbeat(): async () {
    _tax();
    ignore _refill();
    await _backup();
  };

  system func preupgrade() {
    dataEntries := Array.map<T.Data, T.DataEntry>(Array.freeze(data), func (d) {
      {
        artId = d.artId;
        owners = d.owners;
        status = d.status;
        ownerIdEntries = Iter.toArray(d.ownerIds.entries());
        transfers = d.transfers;
      }
    });

    ledgerEntries := Array.filter<T.PrincipalToNatEntry>(Iter.toArray(ledger.entries()), func ((_, bal)) {
      bal > 0
    });
  };

  system func postupgrade() {
    let filteredEntries = Array.filter<T.PrincipalToNatEntry>(ledgerEntries, func((_, balance)) { balance > 0 });
    ledger := HashMap.fromIter<Principal, Nat>(filteredEntries.vals(), filteredEntries.size(), Principal.equal, Principal.hash);

    cubesSupply := Array.foldLeft<T.PrincipalToNatEntry, Nat>(ledgerEntries, 0, func (sum, (_, bal)) {
      sum + bal
    });

    data := Array.thaw(Array.map<T.DataEntry, T.Data>(dataEntries, func (d) {
      {
        artId = d.artId;
        owners = d.owners;
        status = d.status;
        ownerIds = HashMap.fromIter<Principal, Nat>(d.ownerIdEntries.vals(), d.ownerIdEntries.size(), Principal.equal, Principal.hash);
        transfers = d.transfers;
      }
    }));
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
  func _tax(): () {
    if (lastTaxTimestamp == 0 ) { return };

    let now = Time.now();

    for (art in data.vals()) {
      let {artId; owners; ownerIds; status; transfers} = art;

      if (art.status.owner != thisPrincipal()) {
        let seconds = Int.abs(now - lastTaxTimestamp) / 1_000_000_000;
        let amount = percentOf(seconds * status.offerValue, ANNUAL_TAX_RATE) / 365 / 24 / 60 / 60;
        Debug.print("tax: " # debug_show(seconds) # "s, price: " # debug_show(status.offerValue) # ", tax amount: " # debug_show(amount));

        if (amount > 0) {
          let ownerBalance = Option.get(ledger.get(status.owner), 0);
          let deductible = Nat.min(ownerBalance, amount);

          // Transfer deductible from owner to self
          taxCollected := taxCollected + deductible;
          ledger.put(thisPrincipal(), Option.get(ledger.get(thisPrincipal()), 0) + deductible);
          ledger.put(status.owner, ownerBalance - deductible);

          // Owner cannot pay full tax: Foreclose
          if (ownerBalance < amount) {
            Debug.print("foreclosure: " # debug_show(art.artId) # ", owner: " # debug_show(thisPrincipal()) # ", balance: " # debug_show(ownerBalance));
            foreclosureCount := foreclosureCount + 1;

            // Transfer to self with 0-value
            let newTransfers = Array.append(transfers, [{
              artId = art.artId;
              id = transfers.size();
              from = status.owner;
              to = thisPrincipal();
              timestamp = now;
              value = 0;
            }]);

            // Owner increases owned time but not value
            let ownerId = Option.unwrap(ownerIds.get(status.owner));
            owners[ownerId] := blockWithTimeNow(owners[ownerId], status);

            // Create new offer
            let newStatus = {
              owner = thisPrincipal();
              offerTimestamp = now;
              offerValue = FORECLOSURE_PRICE;
            };

            data[artId] := {
              artId = artId;
              owners = owners;
              status = newStatus;
              ownerIds = ownerIds;
              transfers = newTransfers;
            }
          };
        };
      };
    };

    // Updated tax timestamp
    lastTaxTimestamp := now;
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

  /*
    Ensure minimum XTC balance by minting raw and burning WTC if needed
  */
  func _mintXtcUpTo(amount: Nat): async Bool {
    if (xtcBalance >= amount) { return true };

    // Ensure we have an extra 1BC of margin
    let amountWithMargin = amount + TC / 1_000;
    if (Cycles.balance() < minimumCycleBalance) { return false };
    let rawBalance = Cycles.balance() - minimumCycleBalance : Nat;

    if (rawBalance + xtcBalance < amountWithMargin) {
      // Not enough liquidity
      if (rawBalance + wtcBalance + xtcBalance < amountWithMargin) {
        return false;
      };

      // burn difference from WTC
      let wtcToBurn = amountWithMargin - xtcBalance - rawBalance : Nat;
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

  /*
    Ensure minimum WTC balance by minting raw and burning XTC if needed
  */
  func _mintWtcUpTo(amount: Nat): async Bool {
    if (wtcBalance >= amount) { return true };

    // Ensure we have an extra 1BC of margin
    let amountWithMargin = amount + TC / 1_000;
    if (Cycles.balance() < minimumCycleBalance) { return false };
    let rawBalance = Cycles.balance() - minimumCycleBalance : Nat;

    if (rawBalance + wtcBalance < amountWithMargin) {
      // Not enough liquidity
      if (rawBalance + wtcBalance + wtcBalance < amountWithMargin) {
        return false;
      };

      // burn difference from XTC
      let xtcToBurn = amountWithMargin - wtcBalance - rawBalance : Nat;
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

  /*
    Backup stable state to another canister every 30 mins
  */
  func _backup(): async () {
    if (Time.now() - lastBackupTime < BACKUP_INTERVAL) {
      return;
    };

    let dump = {
      ledgerEntries = Array.filter<T.PrincipalToNatEntry>(Iter.toArray(ledger.entries()), func ((_, bal)) {
        bal > 0
      });
      dataEntries = Array.map<T.Data, T.DataEntry_shared>(Array.freeze(data), func (d) {
        {
          artId = d.artId;
          owners = Array.freeze(d.owners);
          status = d.status;
          ownerIdEntries = Iter.toArray(d.ownerIds.entries());
          transfers = d.transfers;
        }
      });
      cubesSupply = cubesSupply;
      wtcBalance = wtcBalance;
      xtcBalance = xtcBalance;
      salesTotal = salesTotal;
      lastTaxTimestamp = lastTaxTimestamp;
      taxCollected = taxCollected;
      feesCollected = feesCollected;
      foreclosureCount = foreclosureCount;
    };

    await backup.load(dump);
  };


  // ---- Helpers

  func blockWithTimeNow(block: T.Block, status: T.Status): T.Block {
    {
      id = block.id;
      owner = block.owner;
      lastPurchasePrice = block.lastPurchasePrice;
      lastSalePrice = block.lastSalePrice;
      lastSaleTime = block.lastSaleTime;
      totalSaleCount = block.totalSaleCount;
      totalOwnedTime = block.totalOwnedTime + (Time.now() - status.offerTimestamp);
      totalValue = block.totalValue;
    }
  };

  func latestBlocks(artId: Nat): [T.Block] {
    let {owners; status} = data[artId];

    Array.map<T.Block, T.Block>(Array.freeze(owners), func (block) {
      if (block.owner == status.owner) {
        blockWithTimeNow(block, status)
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
