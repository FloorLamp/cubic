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
import Text "mo:base/Text";
import Time "mo:base/Time";

import Shared "./Shared";
import T "../Types";

module {
  public func make(data: [T.Transfer]): Text {
    let length = data.size();
    let count = Nat.min(12, length);
    let dt = Float.fromInt(Time.now() / 1_000_000_000);
    let hourOffset : Float = 30 * (((dt / 3600) % 12) + (dt % 3600) / 3600);
    let inputs = Shared.join(Array.tabulate<Text>(count, func (i) {
      let transfer = data[length - count + i];
      let id = Principal.toText(transfer.to);
      let ii : Float = Float.fromInt(count) - 1 - Float.fromInt(i);
      let color = "hsla(" # Nat32.toText(Principal.hash(transfer.to) % 360) # "," # Float.toText(100 - ii * (95 / 11)) # "%," # Float.toText(50 - ii * (30 / 11)) # "%,100%)";

      let blob = Blob.toArray(Principal.toBlob(transfer.to));
      var y : Float = 5;
      var circles = Shared.join(Array.tabulate<Text>(blob.size(), func (n) {
        let width : Float = (Float.fromInt(n) + 1) * 2;
        let height : Float = Float.fromInt(Nat8.toNat(blob[n])) / 100;
        let rect = "<rect width='" # Float.toText(width) # "' height='" # Float.toText(height) # "' x='" # Float.toText(-width) # "' y='" # Float.toText(-(y + height)) # "' fill='url(#bg-" # id # ")' />";
        y += height / 2;
        let circle = "<circle cx='0' cy='" # Float.toText(-y) # "' r='" # Float.toText(height / 2) # "' fill='" # color # "' />";
        y += height / 2 + 2;
        circle # rect
      }));
      if (i == 0) {
        circles := circles # "<circle cx='0' cy='0' r='2.5' fill='rgba(0,0,0,.2)' stroke='" # color # "' stroke-width='0.5' />"
      };
      "<g transform='rotate(" # Float.toText(-30 * ii + hourOffset) # ")'> <defs> <linearGradient id='bg-" # id # "' x1='100%' y1='0%' x2='0%' y2='0%'> <stop offset='0%' stop-color='" # color # "' /> <stop offset='100%' stop-color='rgba(0,0,0,0)' /> </linearGradient> </defs>" #
        circles #
      "</g>"
    }));

    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><clipPath id='clip'> <rect x='5' y='5' width='90' height='90' /> </clipPath>" # Shared.SHADOW # "<radialGradient id='bg'> <stop offset='10%' stop-color='#282828' /> <stop offset='100%' stop-color='#0f0f0f' /> </radialGradient></defs><rect x='5' y='5' width='90' height='90' fill='url(#bg)' filter='url(#shadow)'/>" #
    "<g clip-path='url(#clip)'>" #
    "<g id='_cubic003' transform='translate(50,50)'>" #
    inputs #
    "</g></g></svg>"
  };
}
