import React from "react";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { canisterId } from "../../declarations/Cubic";
import { padProjectId, principalColor } from "../../lib/blocks";
import { dateTimeFromNanos } from "../../lib/datetime";
import { ParsedSummary } from "../../lib/types";
import { shortPrincipal } from "../../lib/utils";
import { TimestampLabel } from "../Labels/TimestampLabel";
import { TokenLogo } from "../Labels/TokenLabel";

export const PurchaseNotification = ({
  purchaser,
  myPurchase,
}: {
  purchaser: ParsedSummary;
  myPurchase: ParsedSummary;
}) => {
  const isForeclosure = purchaser.status.owner.toText() === canisterId;

  return (
    <div className="flex items-start">
      <div
        className="w-6 h-6 mr-2 flex items-center justify-center"
        style={
          !isForeclosure
            ? { backgroundColor: principalColor(purchaser.status.owner) }
            : {}
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
            shortPrincipal(purchaser.status.owner)
          )}
        </strong>

        {isForeclosure ? (
          <TimestampLabel
            dt={dateTimeFromNanos(purchaser.status.offerTimestamp)}
          />
        ) : (
          <span>
            Purchased {padProjectId(purchaser.projectId)} from you for{" "}
            <strong className="inline-flex items-center">
              {myPurchase?.status.offerValue} <TokenLogo />
            </strong>
          </span>
        )}
      </div>
    </div>
  );
};
