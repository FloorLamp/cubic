import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useGlobalContext } from "../Store/Store";

export const Subscriptions = () => {
  const {
    state: { isAuthed },
  } = useGlobalContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Clear cache when logging in or out
    queryClient.removeQueries();
  }, [isAuthed]);

  return null;
};
