import { useQuery } from "react-query";
import { useXtc } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";

export const useXtcBalance = () => {
  const xtc = useXtc();

  return useQuery(
    "xtcBalance",
    async () => {
      const result = await xtc.balance([]);
      return Number(result) / 1e12;
    },
    {
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
