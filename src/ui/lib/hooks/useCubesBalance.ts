import { Principal } from "@dfinity/principal";
import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";

export const useCubesBalance = (user?: Principal) => {
  const cubic = useCubic();

  return useQuery(
    ["cubesBalance", user?.toText()],
    async () => {
      const result = await cubic.balance(user ? [user] : []);
      return Number(result) / 1e12;
    },
    {
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
