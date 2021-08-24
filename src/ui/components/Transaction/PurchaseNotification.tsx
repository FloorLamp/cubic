import React from "react";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { canisterId } from "../../declarations/Cubic";
import { blockColor } from "../../lib/blocks";
import { dateTimeFromNanos } from "../../lib/datetime";
import { ParsedStatus } from "../../lib/types";
import { shortPrincipal } from "../../lib/utils";
import { TimestampLabel } from "../Labels/TimestampLabel";
import { TokenLogo } from "../Labels/TokenLabel";

export const PurchaseNotification = ({ status }: { status: ParsedStatus }) => {
  const isForeclosure = status.status.owner.toText() === canisterId;

  return (
    <div className="flex items-start">
      <div
        className="w-6 h-6 mr-2 flex items-center justify-center"
        style={
          !isForeclosure ? { backgroundColor: blockColor(status.block) } : {}
        }
      >
        {isForeclosure && (
          <BsFillExclamationCircleFill className="text-red-500" />
        )}
      </div>
      <div>
        <strong className="block">
          {isForeclosure ? (
            <span className="text-red-500">Foreclosed</span>
          ) : (
            shortPrincipal(status.status.owner)
          )}
        </strong>

        {isForeclosure ? (
          <TimestampLabel
            dt={dateTimeFromNanos(status.status.offerTimestamp)}
          />
        ) : (
          <span>
            Purchased Cubic from you for{" "}
            <strong>{status.status.offerValue}</strong> <TokenLogo />
          </span>
        )}
      </div>
    </div>
  );
};
