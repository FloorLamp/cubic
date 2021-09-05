import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useArt = ({ artId }: { artId: string }) => {
  const cubic = useCubic();

  return useQuery(
    ["art", artId],
    async () => {
      const result = await cubic.art(BigInt(artId));
      return result;
    },
    {
      enabled: !!artId,
      keepPreviousData: true,
      placeholderData: [null, []],
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
