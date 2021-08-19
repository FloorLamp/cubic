import React from "react";
import { CgSpinner } from "react-icons/cg";
import { dateTimeFromNanos } from "../lib/datetime";
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

  const isOwner = data && principalIsEqual(data.owner, principal);

  return (
    <Panel className="max-w-sm w-full p-4 flex flex-col gap-4">
      <div>
        <label>Current Owner</label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2 className="font-bold leading-tight">
            {isOwner ? "You!" : data?.owner.toText()}
          </h2>
        )}
      </div>

      <div>
        <label>Owned Since</label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2 className="font-bold">
            <TimestampLabel dt={dateTimeFromNanos(data.offerTimestamp)} />
          </h2>
        )}
      </div>

      <div>
        <label>Current Offer Price</label>
        {isLoading ? (
          <CgSpinner className="inline-block animate-spin" />
        ) : (
          <h2 className="font-bold">
            {formatNumber(data.offerValue, 12)} Cubes
          </h2>
        )}
      </div>

      {!isOwner && (
        <div>
          <PurchaseModal />
        </div>
      )}
    </Panel>
  );
}
