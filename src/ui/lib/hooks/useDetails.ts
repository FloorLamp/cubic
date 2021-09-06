import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useDetails = ({ id }: { id: string }) => {
  const cubic = useCubic();

  return useQuery(
    ["details", id],
    async () => {
      const result = await cubic.details(BigInt(id));
      return result;
    },
    {
      enabled: !!id,
      keepPreviousData: true,
      placeholderData: [null, []],
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
