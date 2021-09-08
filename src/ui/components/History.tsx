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
  const events = data
    ? isPreview
      ? data?.events.slice(0, 9)
      : data?.events
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
            {pluralize("Event", Number(data?.count ?? 0))}
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
            <div className="w-24 pl-2">Event</div>
            <div className="flex-1">User</div>
            {!isPreview && <div className="hidden sm:flex flex-1">Seller</div>}
            <div className="hidden md:block flex-1 text-right">Timestamp</div>
            <div className="hidden sm:block flex-1 text-right">Price</div>
          </div>
          <ul className="text-sm flex flex-col divide-y divide-gray-300">
            {events.map((tx, i) => {
              const dt = dateTimeFromNanos(tx.timestamp).toUTC();
              const dtDisplay = isPreview
                ? dt.toRelative()
                : dt.toLocaleString({
                    ...DateTime.DATETIME_SHORT,
                  });
              if ("Transfer" in tx.data) {
                const isInitialSale = tx.id === BigInt(0);
                const isFromForeclosed =
                  tx.data.Transfer.from.toText() === canisterId &&
                  !isInitialSale;
                const isForeclosure =
                  tx.data.Transfer.to.toText() === canisterId;
                return (
                  <li key={tx.id.toString()} className="flex py-0.5">
                    <div className="w-24 pl-2">
                      {isForeclosure ? (
                        <span className="text-red-500">Foreclosure</span>
                      ) : (
                        "Sale"
                      )}
                    </div>
                    <div className="flex-1 flex items-center">
                      {isPreview && isForeclosure ? (
                        <>
                          {!isFromForeclosed && !isInitialSale && (
                            <div
                              className="w-3 h-3 mr-2"
                              style={{
                                backgroundColor: principalColor(
                                  tx.data.Transfer.from
                                ),
                              }}
                            />
                          )}
                          <div className="flex-1 overflow-hidden whitespace-nowrap">
                            <IdentifierLabelWithButtons
                              type="Principal"
                              id={tx.data.Transfer.from}
                              isShort={true}
                              showButtons={false}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {!isForeclosure && (
                            <div
                              className="w-3 h-3 mr-2"
                              style={{
                                backgroundColor: principalColor(
                                  tx.data.Transfer.to
                                ),
                              }}
                            />
                          )}
                          <div className="flex-1 overflow-hidden whitespace-nowrap">
                            {!isForeclosure && (
                              <IdentifierLabelWithButtons
                                type="Principal"
                                id={tx.data.Transfer.to}
                                isShort={true}
                                showButtons={!isPreview}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {!isPreview && (
                      <div className="hidden sm:flex flex-1 items-center">
                        {!isFromForeclosed && !isInitialSale && (
                          <div
                            className="w-3 h-3 mr-2"
                            style={{
                              backgroundColor: principalColor(
                                tx.data.Transfer.from
                              ),
                            }}
                          />
                        )}
                        <div className="flex-1 overflow-hidden whitespace-nowrap">
                          {isInitialSale ? (
                            <span className="text-gray-400">None</span>
                          ) : isFromForeclosed ? (
                            <span className="text-gray-400">Foreclosure</span>
                          ) : (
                            <IdentifierLabelWithButtons
                              type="Principal"
                              id={tx.data.Transfer.from}
                              isShort={true}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="hidden md:block flex-1 text-right">
                      {dtDisplay}
                    </div>
                    <div className="flex-1 text-right">
                      {isForeclosure
                        ? "—"
                        : formatNumber(
                            Number(tx.data.Transfer.value) / 1e12
                          )}{" "}
                      <TokenLogo />
                    </div>
                  </li>
                );
              } else {
                return (
                  <li key={tx.id.toString()} className="flex py-0.5">
                    <div className="w-24 pl-2">Offer</div>
                    <div className="flex-1 flex items-center">
                      <div
                        className="w-3 h-3 mr-2"
                        style={{
                          backgroundColor: principalColor(
                            tx.data.PriceChange.owner
                          ),
                        }}
                      />
                      <div className="flex-1 overflow-hidden whitespace-nowrap">
                        <IdentifierLabelWithButtons
                          type="Principal"
                          id={tx.data.PriceChange.owner}
                          isShort={true}
                          showButtons={!isPreview}
                        />
                      </div>
                    </div>
                    {!isPreview && (
                      <div className="hidden sm:flex flex-1 items-center" />
                    )}
                    <div className="hidden md:block flex-1 text-right">
                      {dtDisplay}
                    </div>
                    <div className="flex-1 text-right overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {formatNumber(Number(tx.data.PriceChange.to) / 1e12)}{" "}
                      <TokenLogo />
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </>
      ) : (
        <span className="text-gray-400 text-sm">No transactions yet.</span>
      )}
    </Panel>
  );
}
