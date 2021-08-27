import { DateTime } from "luxon";
import React from "react";
import { canisterId } from "../declarations/Cubic";
import { principalColor } from "../lib/blocks";
import { dateTimeFromNanos } from "../lib/datetime";
import { useHistory } from "../lib/hooks/useHistory";
import { formatNumber, pluralize } from "../lib/utils";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";
import Panel from "./Containers/Panel";
import { TokenLogo } from "./Labels/TokenLabel";

export function History() {
  const { data } = useHistory(false);

  return (
    <Panel className="p-8 w-full">
      <h2 className="text-xl mb-4">
        {data ? formatNumber(data.count) : null}{" "}
        {pluralize("Transaction", Number(data?.count ?? 0))}
      </h2>

      <div className="flex items-center mb-2">
        <div className="w-12">Tx ID</div>
        <div className="flex-1">Seller</div>
        <div className="flex-1">Buyer</div>
        <div className="hidden md:block w-40 text-right">Timestamp</div>
        <div className="hidden sm:block w-32 text-right">Price</div>
      </div>
      <ul className="text-sm flex flex-col divide-y divide-gray-300">
        {data?.transfers.map((tx, i) => {
          const isInitialSale = tx.from.toUint8Array().length === 0;
          const isFromForeclosed = tx.from.toText() === canisterId;
          const isForeclosure = tx.to.toText() === canisterId;
          return (
            <li
              key={i}
              className="flex flex-col xs:flex-row xs:items-center py-0.5"
            >
              <div className="w-12 pl-2 text-gray-400">
                {formatNumber(tx.id)}
              </div>
              <div className="flex-1 flex items-center">
                <div
                  className="w-3 h-3 mr-2"
                  style={
                    !isFromForeclosed && !isInitialSale
                      ? {
                          backgroundColor: principalColor(tx.from),
                        }
                      : undefined
                  }
                />
                <div className="flex-1 overflow-hidden whitespace-nowrap">
                  {isInitialSale ? (
                    <span className="text-gray-400">None</span>
                  ) : isFromForeclosed ? (
                    <span className="text-red-500">Foreclosed</span>
                  ) : (
                    <IdentifierLabelWithButtons
                      type="Principal"
                      id={tx.from}
                      isShort={true}
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <div
                  className="w-3 h-3 mr-2"
                  style={
                    !isForeclosure
                      ? {
                          backgroundColor: principalColor(tx.to),
                        }
                      : undefined
                  }
                />
                <div className="flex-1 overflow-hidden whitespace-nowrap">
                  {isForeclosure ? (
                    <span className="text-red-500">Foreclosed</span>
                  ) : (
                    <IdentifierLabelWithButtons
                      type="Principal"
                      id={tx.to}
                      isShort={true}
                    />
                  )}
                </div>
              </div>
              <div className="hidden md:block w-40 text-right">
                {dateTimeFromNanos(tx.timestamp)
                  .toUTC()
                  .toLocaleString({
                    ...DateTime.DATETIME_SHORT,
                  })}
              </div>
              <div className="hidden sm:block w-32 text-right">
                {isForeclosure ? "—" : formatNumber(Number(tx.value) / 1e12)}{" "}
                <TokenLogo />
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
