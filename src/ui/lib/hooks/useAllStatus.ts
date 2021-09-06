import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";
import { ParsedStatus } from "../types";

export const useAllStatus = () => {
  const cubic = useCubic();

  return useQuery<ParsedStatus[]>(
    "allStatus",
    async () => {
      const results = await cubic.getAllStatus();
      return results.map(({ status, owner }, i) => ({
        projectId: i.toString(),
        status: { ...status, offerValue: Number(status.offerValue) / 1e12 },
        owner: owner[0] ? owner[0] : null,
      }));
    },
    {
      keepPreviousData: true,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
