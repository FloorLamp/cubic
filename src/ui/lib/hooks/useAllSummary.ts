import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";
import { ParsedSummary } from "../types";

export const useAllSummary = () => {
  const cubic = useCubic();

  return useQuery<ParsedSummary[]>(
    "allSummary",
    async () => {
      const results = await cubic.allSummary();
      return results.map(({ status, details, owner }, i) => ({
        projectId: i.toString(),
        details,
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
