import React from "react";
import { formatDuration, secondsToDuration } from "../lib/datetime";
import { useArt } from "../lib/hooks/useArt";
import { principalColor } from "../lib/principalColor";
import { formatNumber } from "../lib/utils";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";
import Panel from "./Containers/Panel";

export function BlocksTable() {
  const art = useArt();

  return (
    <Panel className="p-8 w-full">
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2" style={{}} />
        <div className="flex-1">Owner</div>
        <div className="w-48 text-right">Total Time Owned</div>
        <div className="w-32 text-right">Total Sales</div>
      </div>
      <ul className="text-sm">
        {art.data?.map(({ owner, totalOwnedTime, totalValue }, i) => {
          return (
            <li key={i} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{
                  backgroundColor: principalColor(owner),
                }}
              />
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <IdentifierLabelWithButtons
                  type="Principal"
                  id={owner}
                  isShort={true}
                />
              </div>
              <div className="w-48 text-right">
                {formatDuration(
                  secondsToDuration(totalOwnedTime / BigInt(1e9))
                )}
              </div>
              <div className="w-32 text-right">
                {formatNumber(Number(totalValue) / 1e12)}
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
