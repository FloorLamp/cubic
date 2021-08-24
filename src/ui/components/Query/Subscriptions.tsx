import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useStatus } from "../../lib/hooks/useStatus";
import { ParsedStatus } from "../../lib/types";
import { principalIsEqual } from "../../lib/utils";
import { Notification } from "../Layout/Notification";
import { useGlobalContext } from "../Store/Store";
import { PurchaseNotification } from "../Transaction/PurchaseNotification";

export const Subscriptions = () => {
  const {
    state: { principal, isAuthed },
  } = useGlobalContext();
  const queryClient = useQueryClient();
  const latestStatus = useStatus();

  useEffect(() => {
    // Clear cache when logging in or out
    queryClient.removeQueries();
    if (!isAuthed) {
      setShowNotification(false);
    }
  }, [isAuthed]);

  const [purchaser, setPurchaser] = useState<ParsedStatus>(null);
  const [status, setStatus] = useState<ParsedStatus>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Show notification if we have lost ownership
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
      {purchaser && <PurchaseNotification status={purchaser} />}
    </Notification>
  );
};
