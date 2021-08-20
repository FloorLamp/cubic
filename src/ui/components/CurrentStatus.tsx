import { Principal } from "@dfinity/principal";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import { canisterId } from "../declarations/Cubic";
import { dateTimeFromNanos } from "../lib/datetime";
import { useCubesBalance } from "../lib/hooks/useCubesBalance";
import { useInfo } from "../lib/hooks/useInfo";
import { useStatus } from "../lib/hooks/useStatus";
import { formatNumber, principalIsEqual } from "../lib/utils";
import Panel from "./Containers/Panel";
import { TimestampLabel } from "./Labels/TimestampLabel";
import { useGlobalContext } from "./Store/Store";
import PurchaseModal from "./Transaction/PurchaseModal";

export function CurrentStatus() {
  const { data, isLoading, error } = useStatus();
  const {
    state: { principal },
  } = useGlobalContext();
  const info = useInfo();
  const ownerBalance = useCubesBalance(data?.owner);
  const dailyTax =
    data && info.data
      ? ((Number(info.data.stats.annualTaxRate) / 1e8) * data.offerValue) / 365
      : 0;

  const ownershipPeriod =
    dailyTax > 0 && ownerBalance.isSuccess
      ? ownerBalance.data / dailyTax
      : null;
  const isOwner = data && principalIsEqual(data.owner, principal);
  const isForeclosed =
    data && principalIsEqual(data.owner, Principal.fromText(canisterId));

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
            {isOwner ? (
              "You!"
            ) : isForeclosed ? (
              <span className="text-red-500">Foreclosed</span>
            ) : (
              data?.owner.toText()
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
            <TimestampLabel dt={dateTimeFromNanos(data.offerTimestamp)} />
          </h2>
        )}
      </div>

      <div>
        <label className="block text-gray-500 text-xs uppercase">
          Current Offer Price
        </label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2>
            <strong>{formatNumber(data.offerValue, 12)} Cubes</strong>{" "}
            {dailyTax > 0 && !isForeclosed && (
              <>({formatNumber(dailyTax)} taxed daily)</>
            )}
          </h2>
        )}
      </div>

      {!isForeclosed && (
        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Projected Ownership Period
          </label>
          {isLoading || info.isLoading || ownerBalance.isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {ownershipPeriod != null ? (
                <>{formatNumber(ownershipPeriod, 2)} Days</>
              ) : (
                "-"
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
