import { Principal } from "@dfinity/principal";
import { useQuery } from "react-query";
import { useCubic, useGlobalContext } from "../../components/Store/Store";
import { FIVE_SECONDS_MS } from "../constants";

export const useCubesBalance = (user_?: Principal) => {
  const cubic = useCubic();
  const {
    state: { principal },
  } = useGlobalContext();
  const user = user_ ?? principal;

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
