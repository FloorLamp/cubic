import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useArt = () => {
  const cubic = useCubic();

  return useQuery(
    "art",
    async () => {
      const result = await cubic.art();
      console.log(result);

      return result;
    },
    {
      keepPreviousData: true,
      placeholderData: [],
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
