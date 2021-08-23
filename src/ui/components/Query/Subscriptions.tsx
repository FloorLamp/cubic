import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { blockColor } from "../../lib/blocks";
import { useStatus } from "../../lib/hooks/useStatus";
import { ParsedStatus } from "../../lib/types";
import { principalIsEqual, shortPrincipal } from "../../lib/utils";
import { TokenLogo } from "../Labels/TokenLabel";
import { Notification } from "../Layout/Notification";
import { useGlobalContext } from "../Store/Store";

export const Subscriptions = () => {
  const {
    state: { principal, isAuthed },
  } = useGlobalContext();
  const queryClient = useQueryClient();
  const latestStatus = useStatus();

  useEffect(() => {
    // Clear cache when logging in or out
    queryClient.removeQueries();
  }, [isAuthed]);

  const [purchaser, setPurchaser] = useState<ParsedStatus>(null);
  const [status, setStatus] = useState<ParsedStatus>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const latestOwner = latestStatus.data?.status.owner;
    if (latestOwner && !principalIsEqual(status?.status.owner, latestOwner)) {
      if (status) {
        console.log("owner changed!");
        if (principalIsEqual(status.status.owner, principal)) {
          // Alert if we are no longer the owner
          setPurchaser(latestStatus.data);
          setShowNotification(true);
        } else if (principalIsEqual(principal, latestOwner)) {
          // Hide alert if we are the new owner
          setPurchaser(null);
          setShowNotification(false);
        }
      }
      setStatus(latestStatus.data);
    }
  }, [latestStatus.data]);

  return (
    <Notification
      open={showNotification}
      handleClose={() => setShowNotification(false)}
    >
      {purchaser && (
        <div className="flex items-start">
          <div
            className="w-6 h-6 mr-2"
            style={{ backgroundColor: blockColor(purchaser.block) }}
          />
          <div>
            <strong className="block">
              {shortPrincipal(purchaser.status.owner)}
            </strong>
            Purchased Cubic from you for{" "}
            <strong>{purchaser.status.offerValue}</strong> <TokenLogo />
          </div>
        </div>
      )}
    </Notification>
  );
};
