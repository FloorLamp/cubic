import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useAllStatus } from "../../lib/hooks/useAllStatus";
import useArtId from "../../lib/hooks/useArtId";
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
  const artId = useArtId();
  const latestStatuses = useAllStatus();

  useEffect(() => {
    // Clear cache when logging in or out
    queryClient.removeQueries();
    if (!isAuthed) {
      setShowNotification(false);
    }
  }, [isAuthed]);

  const [myPurchase, setMyPurchase] = useState<ParsedStatus>(null);
  const [purchaser, setPurchaser] = useState<ParsedStatus>(null);
  const [status, setStatus] = useState<ParsedStatus>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Show notification if we have lost ownership
  useEffect(() => {
    if (!latestStatuses.data) {
      return;
    }
    for (const latestStatus of latestStatuses.data) {
      const latestOwner = latestStatus.status.owner;
      if (!principalIsEqual(status?.status.owner, latestOwner)) {
        if (status) {
          console.log("owner changed!");
          if (principalIsEqual(status.status.owner, principal)) {
            // Alert if we are no longer the owner
            setPurchaser(latestStatus);
            setShowNotification(true);
          } else if (principalIsEqual(principal, latestOwner)) {
            // Hide alert if we are the new owner
            setPurchaser(null);
            setShowNotification(false);
          }
        }
        setStatus(latestStatus);
      }
      if (principalIsEqual(latestOwner, principal)) {
        setMyPurchase(latestStatus);
      }
    }
  }, [latestStatuses.data]);

  return (
    <Notification
      open={showNotification}
      handleClose={() => setShowNotification(false)}
    >
      {purchaser && (
        <PurchaseNotification purchaser={purchaser} myPurchase={myPurchase} />
      )}
    </Notification>
  );
};
