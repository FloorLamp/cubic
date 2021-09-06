import classNames from "classnames";
import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { canisterId } from "../declarations/Cubic";
import { principalColor } from "../lib/blocks";
import { dateTimeFromNanos } from "../lib/datetime";
import { useHistory } from "../lib/hooks/useHistory";
import useId from "../lib/hooks/useId";
import { formatNumber, pluralize } from "../lib/utils";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";
import Panel from "./Containers/Panel";
import { TokenLogo } from "./Labels/TokenLabel";

export function History({ isPreview }: { isPreview?: boolean }) {
  const id = useId();
  const { data, isSuccess } = useHistory();
  const transfers = data
    ? isPreview
      ? data?.transfers.slice(0, 9)
      : data?.transfers
    : [];

  return (
    <Panel
      className={classNames("w-full flex-1 overflow-hidden", {
        "p-4": isPreview,
        "p-8": !isPreview,
      })}
    >
      <h2
        className={classNames({
          "text-xl mb-4": !isPreview,
          "mb-2 flex justify-between items-baseline": isPreview,
        })}
      >
        {isPreview ? (
          <>
            <span>Latest Transactions</span>
            <Link href={`/p/${id}/details`}>
              <a className="text-gray-500 text-xs group hover:underline">
                View All
                <FiChevronRight className="inline-block group-hover:translate-x-1 transform transition-transform duration-75" />
              </a>
            </Link>
          </>
        ) : (
          <>
            {data ? formatNumber(data.count) : null}{" "}
            {pluralize("Transaction", Number(data?.count ?? 0))}
          </>
        )}
      </h2>

      {isSuccess && data.count > 0 ? (
        <>
          <div
            className={classNames("flex items-center mb-1", {
              "text-xs uppercase text-gray-500": isPreview,
            })}
          >
            <div className="w-12">Tx ID</div>
            {!isPreview && <div className="hidden sm:flex flex-1">Seller</div>}
            <div className="flex-1">Buyer</div>
            <div className="hidden md:block w-40 text-right">Timestamp</div>
            <div className="hidden sm:block w-28 text-right">Price</div>
          </div>
          <ul className="text-sm flex flex-col divide-y divide-gray-300">
            {transfers.map((tx, i) => {
              const isInitialSale = tx.id === BigInt(0);
              const isFromForeclosed =
                tx.from.toText() === canisterId && !isInitialSale;
              const isForeclosure = tx.to.toText() === canisterId;
              return (
                <li key={i} className="flex py-0.5">
                  <div className="w-12 pl-2 text-gray-400">
                    {formatNumber(tx.id)}
                  </div>
                  {!isPreview && (
                    <div className="hidden sm:flex flex-1 items-center">
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
                  )}
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
                          showButtons={!isPreview}
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
                  <div className="w-28 text-right">
                    {isForeclosure
                      ? "—"
                      : formatNumber(Number(tx.value) / 1e12)}{" "}
                    <TokenLogo />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <span className="text-gray-400 text-sm">No transactions yet.</span>
      )}
    </Panel>
  );
}
