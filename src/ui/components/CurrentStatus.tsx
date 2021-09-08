import { Principal } from "@dfinity/principal";
import React, { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { canisterId } from "../declarations/Cubic";
import { ownerColor } from "../lib/blocks";
import {
  dateTimeFromNanos,
  formatDuration,
  secondsToDuration,
} from "../lib/datetime";
import { useAllSummary } from "../lib/hooks/useAllSummary";
import { useCubesBalance } from "../lib/hooks/useCubesBalance";
import useId from "../lib/hooks/useId";
import { useInfo } from "../lib/hooks/useInfo";
import { useSummary } from "../lib/hooks/useSummary";
import { formatNumber, principalIsEqual } from "../lib/utils";
import Panel from "./Containers/Panel";
import { TimestampLabel } from "./Labels/TimestampLabel";
import { TokenLogo } from "./Labels/TokenLabel";
import { useGlobalContext } from "./Store/Store";
import PurchaseModal from "./Transaction/PurchaseModal";
import SetPriceModal from "./Transaction/SetPriceModal";

export function CurrentStatus() {
  const id = useId();
  const { isLoading } = useAllSummary();
  const data = useSummary({ id });
  const {
    state: { principal },
  } = useGlobalContext();
  const info = useInfo();
  const ownerBalance = useCubesBalance(data?.status.owner);
  const ownerStatus = data
    ? principalIsEqual(data.status.owner, Principal.fromText(canisterId))
      ? data.status.isForeclosed
        ? "Foreclosed"
        : "New"
      : "Owned"
    : null;

  const dailyTax =
    data && info.data && ownerStatus
      ? ((Number(info.data.stats.annualTaxRate) / 1e8) *
          data.status.offerValue) /
        365
      : 0;

  const ownershipSeconds =
    dailyTax > 0 && ownerBalance.isSuccess
      ? (ownerBalance.data / dailyTax) * 86400
      : null;
  const isOwner = data && principalIsEqual(data.status.owner, principal);

  useEffect(() => {
    if (ownershipSeconds != null && ownershipSeconds < 600) {
      info.refetch();
    }
  }, [ownershipSeconds]);

  return (
    <Panel className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
      <div>
        <label className="block text-gray-500 text-xs uppercase">
          Current Owner
        </label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2 className="font-bold leading-tight">
            {ownerStatus === "Foreclosed" ? (
              <span className="text-red-500">Foreclosed</span>
            ) : ownerStatus === "New" ? (
              <span className="text-gray-400">None</span>
            ) : data ? (
              <div>
                <div
                  className="w-3 h-3 mr-2 inline-block"
                  style={{
                    backgroundColor: ownerColor(data.owner),
                  }}
                />
                {isOwner ? "You!" : data.status.owner.toText()}
              </div>
            ) : (
              "—"
            )}
          </h2>
        )}
      </div>

      <div>
        <label className="block text-gray-500 text-xs uppercase">
          {ownerStatus === "New"
            ? "Launched"
            : `${ownerStatus === "Foreclosed" ? "Foreclosed" : "Owned"} Since`}
        </label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          data && (
            <h2 className="font-bold">
              <TimestampLabel
                dt={dateTimeFromNanos(data.status.offerTimestamp)}
              />
            </h2>
          )
        )}
      </div>

      <div>
        <label className="block text-gray-500 text-xs uppercase">
          Current Price
        </label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          data && (
            <h2>
              <strong className="inline-flex items-center">
                {formatNumber(data.status.offerValue, 12)} <TokenLogo />
              </strong>{" "}
              {dailyTax > 0 && ownerStatus === "Owned" && (
                <span className="text-gray-400">
                  ({formatNumber(dailyTax)} daily tax)
                </span>
              )}
            </h2>
          )
        )}
      </div>

      {ownerStatus === "Owned" && (
        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Estimated Ownership Period
          </label>
          {isLoading || info.isLoading || ownerBalance.isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {ownershipSeconds != null
                ? ownershipSeconds > 86400
                  ? `${formatNumber(ownershipSeconds / 86400, 2)} days`
                  : formatDuration(secondsToDuration(ownershipSeconds))
                : "—"}
            </h2>
          )}
        </div>
      )}

      {isOwner ? <SetPriceModal /> : <PurchaseModal />}
    </Panel>
  );
}
