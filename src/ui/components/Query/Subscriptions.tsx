import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useAllSummary } from "../../lib/hooks/useAllSummary";
import { ParsedSummary } from "../../lib/types";
import { principalIsEqual } from "../../lib/utils";
import { useGlobalContext, useNotifications } from "../Store/Store";

export const Subscriptions = () => {
  const {
    state: { principal, isAuthed },
  } = useGlobalContext();
  const queryClient = useQueryClient();
  const latestStatuses = useAllSummary();

  const { add, clear } = useNotifications();
  useEffect(() => {
    // Clear cache when logging in or out
    queryClient.removeQueries();
    if (!isAuthed) {
      clear();
    }
  }, [isAuthed]);

  // Show notification if we have sold something
  const [owned, setOwned] = useState<ParsedSummary[]>([]);
  useEffect(() => {
    if (!latestStatuses.data) {
      return;
    }

    const latestOwned = latestStatuses.data.filter(({ status: { owner } }) =>
      principalIsEqual(owner, principal)
    );
    if (owned.length > latestOwned.length) {
      const sold = owned.filter(
        ({ projectId }) =>
          !latestOwned.find((current) => current.projectId === projectId)
      );
      sold.forEach((myPurchase) => {
        add({
          type: "Sale",
          myPurchase,
          purchaser: latestStatuses.data.find(
            ({ projectId }) => projectId === myPurchase.projectId
          ),
        });
      });
    }
    setOwned(latestOwned);
  }, [latestStatuses.data]);

  return null;
};
