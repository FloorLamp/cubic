import { useQuery } from "react-query";
import * as Minter from "../../declarations/Minter/index";
import { defaultAgent } from "../canisters";

const minter = Minter.createActor(defaultAgent);

export const useMinterIsAvailable = () => {
  return useQuery(
    "minterIsActive",
    async () => {
      const result = await minter.isActive();
      return !result;
    },
    {
      keepPreviousData: true,
      placeholderData: true,
      refetchInterval: 1000,
    }
  );
};
