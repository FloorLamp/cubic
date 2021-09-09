import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";

import Shared "./Shared";
import T "../Types";

module {
  type Data = {
    color: Text;
    size: Float;
  };

  func color(owner: T.Block): Text {
    let TC = 1_000_000_000_000;
    let sat =
      if (owner.totalValue < TC) { 0 }
      else if (owner.totalValue < 10 * TC) { 25 }
      else if (owner.totalValue < 100 * TC) { 50 }
      else if (owner.totalValue < 1000 * TC) { 75 }
      else { 100 };

    "hsl(" # Nat32.toText(Shared.hash(owner.owner) % 360) # "," # Nat.toText(sat) # "%,50%)"
  };

  public func make(data: [T.Block]): Text {
    let inputs = Array.map<T.Block, Data>(data, func (d) {
      {
        color = color(d);
        size = Float.fromInt(d.totalOwnedTime) / 1e9;
      }
    });
    let sumSize = Array.foldLeft<Data, Float>(inputs, 0, func (sum, { size }) { sum + size });
    let totalLength : Float = 720;
    let scale : Float = totalLength / sumSize;
    let fullScaleOwnerCount : Float = 1000;
    let minCubeScale = 0.5;
    let cubeScale : Float =
      (Float.min(Float.fromInt(inputs.size()), fullScaleOwnerCount) / fullScaleOwnerCount) *
        (1 - minCubeScale) + minCubeScale;
    let translate = ((1 - cubeScale) * 80) / 2 + 10;

    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs>" # Shared.SHADOW # "<style>#_cubic000 polyline { fill: none; stroke-width: 9; }</style></defs><rect x='5' y='5' width='90' height='90' fill='#ebe4d8' filter='url(#shadow)'/>" #
    "<g id='_cubic000' transform='translate(" # Float.toText(translate) # "," # Float.toText(translate) #
    ")scale(" # Float.toText(cubeScale) # ")'>" #
    Array.foldLeft<Data, (Text, Float)>(inputs, ("", 0), func((lines, pos), { color; size }) {
      let scaled = size * scale;
      (lines # "<polyline points='-0.5 4 76 4 76 76 4 76 4 13 67 13 67 67 13 67 13 22 58 22 58 58 22 58 22 31 49 31 49 49 31 49 31 40 45 40' stroke-dasharray='" #
      (if (pos == 0) { Float.toText(scaled) # "," # Float.toText(totalLength) }
      else { "0," # Float.toText(pos) # "," # Float.toText(totalLength) })
      # "' stroke='" # color # "'/>",
      pos + scaled
      )
    }).0 #
    "</g></svg>"
  };
}
