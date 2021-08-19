import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useStatus = () => {
  const cubic = useCubic();

  return useQuery(
    "status",
    async () => {
      const result = await cubic.getStatus();
      console.log(result);

      return { ...result, offerValue: Number(result.offerValue) / 1e12 };
    },
    {
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
