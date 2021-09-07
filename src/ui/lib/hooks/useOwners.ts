import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useOwners = ({ id }: { id: string }) => {
  const cubic = useCubic();

  return useQuery(
    ["owners", id],
    async () => {
      const result = await cubic.owners(BigInt(id));
      return result;
    },
    {
      enabled: !!id,
      keepPreviousData: true,
      placeholderData: [],
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
