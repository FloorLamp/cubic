import React from "react";
import { principalColor } from "../lib/blocks";
import { formatDuration, secondsToDuration } from "../lib/datetime";
import { useArt } from "../lib/hooks/useArt";
import { useStatus } from "../lib/hooks/useStatus";
import { formatNumber, principalIsEqual } from "../lib/utils";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";
import Panel from "./Containers/Panel";

export function BlocksTable() {
  const art = useArt();
  const status = useStatus();

  return (
    <Panel className="p-8 w-full">
      <div className="flex items-center mb-2">
        <div className="w-6" />
        <div className="flex-1">Owner</div>
        <div className="hidden xs:block w-48 text-right">Total Time Owned</div>
        <div className="hidden sm:block w-32 text-right">Total Sales</div>
      </div>
      <ul className="text-sm flex flex-col gap-2 xs:gap-0">
        {art.data?.map(({ owner, totalOwnedTime, totalValue }, i) => {
          const isOwner =
            status.data && principalIsEqual(status.data.owner, owner);
          return (
            <li key={i} className="flex flex-col xs:flex-row xs:items-center">
              <div className="flex-1 flex items-center">
                <div
                  className="w-3 h-3 mr-2"
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
                  {isOwner && (
                    <span className="px-2 py-1 leading-none text-xs rounded-md bg-gray-300 text-gray-700 ml-2">
                      Current Owner
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-5 xs:ml-0 xs:w-48 xs:text-right">
                {formatDuration(
                  secondsToDuration(totalOwnedTime / BigInt(1e9))
                )}
              </div>
              <div className="hidden sm:block w-32 text-right">
                {formatNumber(Number(totalValue) / 1e12)}
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
