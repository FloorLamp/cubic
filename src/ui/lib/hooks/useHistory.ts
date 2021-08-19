import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useHistory = () => {
  const cubic = useCubic();

  return useQuery(
    "history",
    async () => {
      const result = await cubic.getHistory();
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
