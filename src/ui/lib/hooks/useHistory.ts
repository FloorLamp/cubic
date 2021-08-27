import { useQuery } from "react-query";
import { useCubic, useGlobalContext } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";
import useArtId from "./useArtId";

export const useHistory = ({ onlyUser }: { onlyUser: boolean }) => {
  const artId = useArtId();
  const cubic = useCubic();
  const {
    state: { principal },
  } = useGlobalContext();

  return useQuery(
    ["history", artId],
    async () => {
      const result = await cubic.getHistory({
        artId: BigInt(artId),
        principal: onlyUser ? [principal] : [],
      });
      return result;
    },
    {
      enabled: !!artId && (!onlyUser || !!principal),
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
