import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";

module {
  public let SHADOW = "<filter id='shadow' x='0' y='0' width='175' height='200'><feOffset result='offOut' in='SourceAlpha' dx='2' dy='2'/><feColorMatrix result='matrixOut' in='offOut' type='matrix' values='0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.2 0'/><feGaussianBlur result='blurOut' in='matrixOut' stdDeviation='1'/><feBlend in='SourceGraphic' in2='blurOut' mode='normal'/></filter>";

  public func hash(arg: Principal): Hash.Hash {
    var hash : Nat32 = 0;
    for (byte in Principal.toBlob(arg).vals()) {
      hash +%= Nat32.fromNat(Nat8.toNat(byte)) + (hash << 1);
    };
    return hash;
  };

  public func join(arg: [Text]): Text {
    Array.foldLeft<Text, Text>(arg, "", func (a, b) { a # b })
  };
}
