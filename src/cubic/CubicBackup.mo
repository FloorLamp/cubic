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

shared actor class CubicBackup() = this {
  stable var ledgerEntries: [T.PrincipalToNatEntry] = [];
  stable var dataEntries: [T.DataEntry_shared] = [];
  stable var cubesSupply: Nat = 0;
  stable var wtcBalance: Nat = 0;
  stable var xtcBalance: Nat = 0;
  stable var salesTotal: Nat = 0;
  stable var lastTaxTimestamp: Int = 0;
  stable var taxCollected: Nat = 0;
  stable var feesCollected: Nat = 0;
  stable var foreclosureCount: Nat = 0;

  let TC = 1_000_000_000_000;
  stable var TRANSACTION_FEE = 1_000_000; // 1%
  stable var ANNUAL_TAX_RATE = 5_000_000; // 5%
  stable var FORECLOSURE_PRICE = 1 * TC; // 1 TC

  public shared({caller}) func get(): async T.Backup {
    assert(caller != Principal.fromText("2vxsx-fae"));

    {
      ledgerEntries = ledgerEntries;
      dataEntries = dataEntries;
      cubesSupply = cubesSupply;
      wtcBalance = wtcBalance;
      xtcBalance = xtcBalance;
      salesTotal = salesTotal;
      lastTaxTimestamp = lastTaxTimestamp;
      taxCollected = taxCollected;
      feesCollected = feesCollected;
      foreclosureCount = foreclosureCount;
    }
  };

  public shared({caller}) func load(data: T.Backup): async () {
    assert(caller == Principal.fromText("6v54r-qqaaa-aaaae-aac5q-cai"));

    ledgerEntries := data.ledgerEntries;
    dataEntries := data.dataEntries;
    cubesSupply := data.cubesSupply;
    wtcBalance := data.wtcBalance;
    xtcBalance := data.xtcBalance;
    salesTotal := data.salesTotal;
    lastTaxTimestamp := data.lastTaxTimestamp;
    taxCollected := data.taxCollected;
    feesCollected := data.feesCollected;
    foreclosureCount := data.foreclosureCount;
  };
};
