import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useInfo = () => {
  const cubic = useCubic();

  return useQuery(
    "info",
    async () => {
      const result = await cubic.info();
      return result;
    },
    {
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
