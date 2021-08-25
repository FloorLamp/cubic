import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Wtc "../cubic/WtcTypes";
import Xtc "../cubic/XtcTypes";

shared actor class Minter(canisters: {
    controller: Principal;
    wtc: Principal;
    xtc: Principal;
  }) = this {

  public type Request = {
    token: { #wtc; #xtc };
    recipient: Principal;
  };
  public type Response = {
    #NoRecipient;
    #NoCyclesReceived;
    #Ok: {
      amount: Nat;
      xtcTransactionId: ?Xtc.TransactionId;
    };
    #Err: Xtc.MintError;
  };

  let CYCLES_MINTER = Principal.fromText("rkp4c-7iaaa-aaaaa-aaaca-cai");
  let wtc = actor (Principal.toText(canisters.wtc)) : Wtc.Self;
  let xtc = actor (Principal.toText(canisters.xtc)) : Xtc.Self;
  let controller: Principal = canisters.controller;

  var activeRequest: ?Request = null;
  var startingBalance: Nat = 0;

  public query func isActive(): async Bool {
    Option.isSome(activeRequest)
  };

  public shared({ caller }) func open(request: Request): async Bool {
    assert(caller == controller);

    switch (activeRequest) {
      case null {
        startingBalance := Cycles.balance();
        activeRequest := ?request;
        true
      };
      case _ {
        false
      }
    }
  };

  public shared({ caller }) func close(): async Response {
    assert(caller == controller);

    let { recipient; token } = switch (activeRequest) {
      case null { return #NoRecipient };
      case (?r) { r };
    };

    let diff = Cycles.balance() - startingBalance : Nat;
    if (diff > 0) {
      Debug.print("Received cycles: " # debug_show(diff));
    } else {
      Debug.print("Closed without receiving cycles");
      activeRequest := null;
      return #NoCyclesReceived;
    };

    Cycles.add(diff);
    let result = switch (token) {
      case (#wtc) {
        await wtc.mint(?#principal(recipient));
        Debug.print("mint WTC success, amount=" # debug_show(diff) # ", recipient=" # debug_show(recipient));
        #Ok({ amount = diff; xtcTransactionId = null })
      };
      case (#xtc) {
        switch (await xtc.mint(?recipient)) {
          case (#Err(error)) {
            Debug.print("minting XTC failed: " # debug_show(error));
            #Err(error)
          };
          case (#Ok(txId)) {
            Debug.print("mint XTC success, amount=" # debug_show(diff) # ", recipient=" # debug_show(recipient));
            #Ok({ amount = diff; xtcTransactionId = ?txId })
          }
        };
      };
    };
    activeRequest := null;
    result;
  };

}
