import { useQuery } from "react-query";
import { useCubic, useGlobalContext } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";
import useId from "./useId";

export const useHistory = (onlyUser?: boolean) => {
  const id = useId();
  const cubic = useCubic();
  const {
    state: { principal },
  } = useGlobalContext();

  return useQuery(
    ["history", id],
    async () => {
      const result = await cubic.getHistory({
        projectId: BigInt(id),
        principal: onlyUser ? [principal] : [],
      });
      return result;
    },
    {
      enabled: !!id && (!onlyUser || !!principal),
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
