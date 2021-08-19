import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";

export const useCubesBalance = () => {
  const cubic = useCubic();

  return useQuery(
    "cubesBalance",
    async () => {
      const result = await cubic.getBalance();
      return Number(result) / 1e12;
    },
    {
      keepPreviousData: true,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
