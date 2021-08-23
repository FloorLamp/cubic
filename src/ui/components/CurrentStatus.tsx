import { Principal } from "@dfinity/principal";
import React, { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { canisterId } from "../declarations/Cubic";
import { blockColor } from "../lib/blocks";
import { dateTimeFromNanos } from "../lib/datetime";
import { useCubesBalance } from "../lib/hooks/useCubesBalance";
import useHeartbeat from "../lib/hooks/useHeartbeat";
import { useInfo } from "../lib/hooks/useInfo";
import { useStatus } from "../lib/hooks/useStatus";
import { formatNumber, principalIsEqual } from "../lib/utils";
import Panel from "./Containers/Panel";
import { TimestampLabel } from "./Labels/TimestampLabel";
import { TokenLogo } from "./Labels/TokenLabel";
import { useGlobalContext } from "./Store/Store";
import PurchaseModal from "./Transaction/PurchaseModal";

export function CurrentStatus() {
  const { data, isLoading, error } = useStatus();
  const {
    state: { principal },
  } = useGlobalContext();
  const info = useInfo();
  const ownerBalance = useCubesBalance(data?.status.owner);
  const isOwned = data?.status.owner.toUint8Array().length > 0;
  const dailyTax =
    data && info.data && isOwned
      ? ((Number(info.data.stats.annualTaxRate) / 1e8) *
          data.status.offerValue) /
        365
      : 0;

  const ownershipPeriod =
    dailyTax > 0 && ownerBalance.isSuccess
      ? ownerBalance.data / dailyTax
      : null;
  const isOwner = data && principalIsEqual(data.status.owner, principal);
  const isForeclosed =
    data && principalIsEqual(data.status.owner, Principal.fromText(canisterId));

  const heartbeat = useHeartbeat();
  useEffect(() => {
    if (ownershipPeriod != null && ownershipPeriod < 0.0003) {
      console.log(
        `low ownershipPeriod: ${ownershipPeriod}, calling heartbeat...`
      );

      heartbeat.mutate();
    }
  }, [ownershipPeriod]);

  return (
    <Panel className="max-w-md w-full p-4 flex flex-col gap-4">
      <div>
        <label className="block text-gray-500 text-xs uppercase">
          Current Owner
        </label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2 className="font-bold leading-tight">
            {isForeclosed ? (
              <span className="text-red-500">Foreclosed</span>
            ) : isOwned ? (
              <div className="flex items-center">
                <div
                  className="w-3 h-3 mr-2 flex-none"
                  style={{
                    backgroundColor: blockColor(data.block),
                  }}
                />
                {isOwner ? "You!" : data.status.owner.toText()}
              </div>
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </h2>
        )}
      </div>

      <div>
        <label className="block text-gray-500 text-xs uppercase">
          {isForeclosed ? "Foreclosed" : "Owned"} Since
        </label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2 className="font-bold">
            <TimestampLabel
              dt={dateTimeFromNanos(data.status.offerTimestamp)}
            />
          </h2>
        )}
      </div>

      <div>
        <label className="block text-gray-500 text-xs uppercase">
          Current Price
        </label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2>
            <strong>
              {formatNumber(data.status.offerValue, 12)} <TokenLogo />
            </strong>{" "}
            {dailyTax > 0 && !isForeclosed && (
              <span className="text-gray-400">
                ({formatNumber(dailyTax)} daily tax)
              </span>
            )}
          </h2>
        )}
      </div>

      {!isForeclosed && (
        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Estimated Ownership Period
          </label>
          {isLoading || info.isLoading || ownerBalance.isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {ownershipPeriod != null ? (
                <>{formatNumber(ownershipPeriod, 2)} Days</>
              ) : (
                "—"
              )}
            </h2>
          )}
        </div>
      )}

      {!isOwner && (
        <div>
          <PurchaseModal />
        </div>
      )}
    </Panel>
  );
}
