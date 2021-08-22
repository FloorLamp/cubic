import React from "react";
import { Block } from "../declarations/Cubic/Cubic.did";
import { blockColor } from "../lib/blocks";
import { formatDuration, secondsToDuration } from "../lib/datetime";
import { useStatus } from "../lib/hooks/useStatus";
import { formatNumber, pluralize, principalIsEqual } from "../lib/utils";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";
import Panel from "./Containers/Panel";

export function BlocksTable({ data }: { data: Block[] }) {
  const status = useStatus();

  return (
    <Panel className="p-8 w-full">
      <div className="flex items-center mb-2">
        <div className="w-6" />
        <div className="flex-1">
          {data.length} {pluralize("Owner", data.length)}
        </div>
        <div className="hidden xs:block w-48 text-right">Total Time Owned</div>
        <div className="hidden sm:block w-32 text-right">Total Sales</div>
      </div>
      <ul className="text-sm flex flex-col gap-2 xs:gap-0">
        {data.slice(0, 100).map((block, i) => {
          const isOwner =
            status.data && principalIsEqual(status.data.owner, block.owner);
          return (
            <li key={i} className="flex flex-col xs:flex-row xs:items-center">
              <div className="flex-1 flex items-center">
                <div
                  className="w-3 h-3 mr-2"
                  style={{
                    backgroundColor: blockColor(block),
                  }}
                />
                <div className="flex-1 overflow-hidden whitespace-nowrap">
                  <IdentifierLabelWithButtons
                    type="Principal"
                    id={block.owner}
                    isShort={true}
                  />
                  {isOwner && (
                    <span className="px-2 py-1 leading-none text-xs rounded-md bg-gray-300 text-gray-700 ml-2">
                      Current Owner
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-5 xs:ml-0 xs:w-64 xs:text-right">
                {formatDuration(
                  secondsToDuration(block.totalOwnedTime / BigInt(1e9))
                )}
              </div>
              <div className="hidden sm:block w-32 text-right">
                {formatNumber(Number(block.totalValue) / 1e12)}
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
