import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import T "../Types";
import Text "mo:base/Text";

module {
  type Data = {
    i: Nat;
    id: Text;
    color: Text;
    path: Text;
    stroke: Float;
  };

  func color(owner: Principal): Text {
    "hsl(" # Nat32.toText(Principal.hash(owner) % 360) # ",100%,50%)"
  };

  public func make(data: [T.Transfer]): Text {
    let length = data.size();
    let count = Nat.min(20, length);
    let inputs = Array.tabulate<Data>(count, func (i) {
      let transfer = data[length - count + i];

      let blob = Blob.toArray(Principal.toBlob(transfer.to));
      let path = Text.join(" ", Iter.fromArray(Array.map<Nat8, Text>(blob, func (n) {
        let y = Float.abs(((Float.fromInt(Nat8.toNat(n)) - 128) / 256) * 45);
        return "q .6 " # Float.toText(y) # ",1.2 0 q .2 " # Float.toText(-y / 4) # ", .6 0"
      })));
      {
        i = i;
        id = Principal.toText(transfer.to);
        color = color(transfer.to);
        path = "M-2 " # Float.toText(Float.fromInt(i) * 3.75) # " h10 " # path # " h10";
        stroke = Float.fromInt(i) * 0.005 + 0.05;
      }
    });
    let gradients = Array.foldLeft<Data, Text>(inputs, "", func (g, { id; color }) {
      g # "<linearGradient id='gradient-" # id # "' x1='0%' y1='0%' x2='100%' y2='0%' > <stop offset='0%' stop-color='#fff' /> <stop offset='100%' stop-color='" # color # "' /> </linearGradient>"
    });

    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><clipPath id='clip'> <rect x='5' y='5' width='90' height='90' /> </clipPath><filter id='shadow' x='0' y='0' width='175' height='200'><feOffset result='offOut' in='SourceAlpha' dx='2' dy='2'/><feColorMatrix result='matrixOut' in='offOut' type='matrix' values='0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.2 0'/><feGaussianBlur result='blurOut' in='matrixOut' stdDeviation='1'/><feBlend in='SourceGraphic' in2='blurOut' mode='normal'/></filter><style>#_cubic001 .path { fill: none; stroke-dasharray: .2 .8; animation: dash 5s linear infinite; } @keyframes dash { 0% { stroke-dashoffset: 1; } 100% { stroke-dashoffset: 0; } }</style>" #
    gradients #
    "</defs><rect x='5' y='5' width='90' height='90' fill='#333' filter='url(#shadow)'/>" #
    "<g clip-path='url(#clip)'>" #
    "<g id='_cubic001' transform='translate(10,10)scale(.8)'>" #
    Array.foldLeft<Data, Text>(inputs, "", func(lines, { i; id; path; stroke }) {
      lines # "<g transform='translate(" # Float.toText((Float.fromInt(count - i)) * 1.4) # ", 10)'> <path d='" #
      path # " v15 h-100 z' stroke='none' fill='#333' /> <path d='" #
      path # "' stroke-width='" # Float.toText(stroke) # "' stroke='url(#gradient-" # id # ")' class='path' pathLength='1' /> </g>"
    }) #
    "</g></g></svg>"
  };
}
