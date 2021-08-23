import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";
import { ParsedStatus } from "../types";

export const useStatus = () => {
  const cubic = useCubic();

  return useQuery<ParsedStatus>(
    "status",
    async () => {
      const [status, block] = await cubic.getStatus();
      return {
        status: { ...status, offerValue: Number(status.offerValue) / 1e12 },
        block: block[0] ? block[0] : null,
      };
    },
    {
      keepPreviousData: true,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
