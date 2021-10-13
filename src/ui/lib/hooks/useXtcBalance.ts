import { useQuery } from "react-query";
import { useGlobalContext, useXtc } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";

export const useXtcBalance = () => {
  const xtc = useXtc();
  const {
    state: { isAuthed },
  } = useGlobalContext();

  return useQuery(
    "xtcBalance",
    async () => {
      const result = await xtc.balance([]);
      return Number(result) / 1e12;
    },
    {
      refetchInterval: FIVE_SECONDS_MS,
      enabled: isAuthed,
    }
  );
};
