import { useQuery } from "react-query";
import { FIVE_SECONDS_MS } from "../constants";
import { ParsedStatus } from "../types";
import { useAllStatus } from "./useAllStatus";

export const useStatus = ({ artId }: { artId: string }) => {
  const allStatus = useAllStatus();

  return useQuery<ParsedStatus>(
    ["status", artId],
    async () => {
      return allStatus.data?.find((item) => item.artId === artId);
    },
    {
      enabled: !!artId,
      keepPreviousData: true,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
