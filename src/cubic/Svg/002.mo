import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";

import Shared "./Shared";
import T "../Types";

module {
  type Rect = {
    x: Float;
    y: Float;
    width: Float;
  };
  type Data = {
    id: Text;
    color: Text;
    rects: [Rect];
  };

  func color(owner: Principal): Text {
    "hsl(" # Nat32.toText(Shared.hash(owner) % 360) # ",100%,50%)"
  };

  func findIndex<A>(arr: [A], f: (A) -> Bool): ?Nat {
    for (i in Iter.range(0, arr.size())) {
      if (f(arr[i])) {
        return ?i;
      }
    };
    null
  };


  public func make(data: [T.Transfer]): Text {
    let ONE_YEAR_SECONDS : Nat = 365 * 24 * 60 * 60;
    let ONE_YEAR_NS : Nat = ONE_YEAR_SECONDS * 1_000_000_000;
    let now = Time.now();
    let startTime = now - ONE_YEAR_NS;
    let startIndex = switch (findIndex<T.Transfer>(data, func (d) {
      d.timestamp >= startTime
    })) {
      case (?0) { 0 };
      case (?i) { i - 1 : Nat };
      case _ { 0 };
    };
    let length = data.size();
    let count : Nat = length - startIndex;

    let side : Float = 100;
    let rows : Nat = 52;
    let height : Float = side / Float.fromInt(rows);
    let totalLength = Float.fromInt(rows) * side;

    var x : Float = 0;
    var row = 0;

    let inputs = Array.tabulate<Data>(count, func (i) {
      let transfer = data[length - i - 1];
      let seconds = ((if (i == 0) { now } else { data[length - i].timestamp }) - transfer.timestamp) / 1_000_000_000;

      var rem = Float.fromInt(seconds) / Float.fromInt(ONE_YEAR_SECONDS) * totalLength;
      var rects : [Rect] = [];
      while (rem > 0 and row < rows) {
        let width = Float.min(rem, side - x);
        rects := Array.append(rects, [{ x = x; width = width; y = Float.fromInt(row) * height }]);
        rem := rem - width;
        x := x + width;
        if (x >= side) {
          x := 0;
          row := row + 1;
        };
      };
      {
        id = Principal.toText(transfer.to);
        color = color(transfer.to);
        rects = rects;
      }
    });

    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><clipPath id='clip'> <rect x='5' y='5' width='90' height='90' /> </clipPath>" # Shared.SHADOW # "<style>#_cubic002 rect { stroke-width: 1.5; stroke: #000; }</style></defs><rect x='5' y='5' width='90' height='90' fill='#333' filter='url(#shadow)'/>" #
    "<g id='_cubic002' transform='translate(10,10)scale(.8)'>" #
    Array.foldLeft<Data, Text>(inputs, "", func(lines, { id; color; rects }) {
      lines # Array.foldLeft<Rect, Text>(rects, "", func(ls, { x; y; width }) {
        ls # "<rect x='" # Float.toText(x) # "' y='" # Float.toText(y) # "' width='" # Float.toText(width) # "' height='" # Float.toText(height) # "' fill='" # color # "' />"
      })
    }) #
    "</g></svg>"
  };
}
