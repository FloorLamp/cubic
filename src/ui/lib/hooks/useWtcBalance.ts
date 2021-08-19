import { useQuery } from "react-query";
import { useGlobalContext, useWtc } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";
import { extErrorToString } from "../utils";

export const useWtcBalance = () => {
  const wtc = useWtc();
  const {
    state: { principal },
  } = useGlobalContext();

  return useQuery(
    "wtcBalance",
    async () => {
      const result = await wtc.balance({
        user: {
          principal,
        },
        token: "WTC",
      });

      if ("ok" in result) {
        const raw = result.ok;
        return Number(raw) / 1e12;
      } else {
        throw extErrorToString(result.err);
      }
    },
    {
      enabled: !!principal,
      keepPreviousData: true,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
