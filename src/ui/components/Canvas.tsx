import React from "react";
import { useArt } from "../lib/hooks/useArt";
import { principalColor } from "../lib/principalColor";
import Panel from "./Containers/Panel";

export function Canvas() {
  const art = useArt();
  return (
    <Panel className="p-8 w-full flex">
      {art.data?.map(({ owner, totalOwnedTime, totalValue }, i) => (
        <div
          key={i}
          className="w-8 h-8"
          style={{
            backgroundColor: principalColor(owner),
          }}
          aria-label={`Owner: ${owner.toText()}\nTotal Value: ${
            Number(totalValue) / 1e12
          }`}
          data-balloon-pos="bottom"
          data-balloon-length="large"
        ></div>
      ))}
    </Panel>
  );
}
