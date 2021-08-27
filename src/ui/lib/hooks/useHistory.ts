import { useQuery } from "react-query";
import { useCubic, useGlobalContext } from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";

export const useHistory = (onlyUser: boolean) => {
  const cubic = useCubic();
  const {
    state: { principal },
  } = useGlobalContext();

  return useQuery(
    "history",
    async () => {
      const result = await cubic.getHistory({
        principal: onlyUser ? [principal] : [],
      });
      return result;
    },
    {
      enabled: !onlyUser || !!principal,
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
