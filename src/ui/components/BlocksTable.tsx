import { DateTime } from "luxon";
import React, { useState } from "react";
import { blockColor } from "../lib/blocks";
import {
  dateTimeFromNanos,
  formatDuration,
  secondsToDuration,
} from "../lib/datetime";
import { useArt } from "../lib/hooks/useArt";
import { useBlocks } from "../lib/hooks/useBlocks";
import { useStatus } from "../lib/hooks/useStatus";
import { Order, OrderBy } from "../lib/types";
import { formatNumber, pluralize, principalIsEqual } from "../lib/utils";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";
import Panel from "./Containers/Panel";
import { TokenLogo } from "./Labels/TokenLabel";

export function BlocksTable() {
  const art = useArt();
  const status = useStatus();
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");
  const blocks = useBlocks(order, orderBy);

  return (
    <Panel className="p-8 w-full">
      <div className="flex items-center mb-2">
        <div className="flex-1">
          {art.data?.length} Unique {pluralize("Owner", art.data?.length)}
        </div>
        <div className="hidden md:block w-40 text-right">Last Owned</div>
        <div className="hidden xs:block w-40 text-right">Time Owned</div>
        <div className="hidden md:block w-32 text-right">Last Sale</div>
        <div className="hidden sm:block w-32 text-right">Total Sales</div>
      </div>
      <ul className="text-sm flex flex-col gap-2 xs:gap-0">
        {blocks.data?.map((block, i) => {
          const isOwner =
            status.data &&
            principalIsEqual(status.data.status.owner, block.owner);
          return (
            <li key={i} className="flex flex-col xs:flex-row xs:items-center">
              <div className="flex-1 flex items-center">
                <div className="w-12 mr-2 text-gray-400">
                  #{formatNumber(block.id)}
                </div>
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
                </div>
              </div>
              <div className="hidden md:block w-40 text-right">
                {block.lastSaleTime > 0 ? (
                  dateTimeFromNanos(block.lastSaleTime)
                    .toUTC()
                    .toLocaleString({
                      ...DateTime.DATETIME_SHORT,
                    })
                ) : (
                  <span className="px-2 py-1 leading-none text-xs rounded-md bg-gray-300 text-gray-800 ml-2">
                    Current Owner
                  </span>
                )}
              </div>
              <div className="ml-5 xs:ml-0 xs:w-40 xs:text-right">
                {formatDuration(
                  secondsToDuration(block.totalOwnedTime / BigInt(1e9))
                )}
              </div>
              <div className="hidden md:block w-32 text-right">
                {formatNumber(Number(block.lastSalePrice) / 1e12)} <TokenLogo />
              </div>
              <div className="hidden sm:block w-32 text-right">
                {formatNumber(Number(block.totalValue) / 1e12)} <TokenLogo />
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
