import { useQuery } from "react-query";
import { FIVE_SECONDS_MS } from "../constants";
import { ParsedStatus } from "../types";
import { useAllStatus } from "./useAllStatus";

export const useStatus = ({ id }: { id: string }) => {
  const allStatus = useAllStatus();

  return useQuery<ParsedStatus>(
    ["status", id],
    async () => {
      return allStatus.data?.find((item) => item.projectId === id);
    },
    {
      enabled: !!id,
      keepPreviousData: true,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
