import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { BlocksRequest } from "../../declarations/Cubic/Cubic.did";
import { ONE_MINUTES_MS } from "../constants";
import { Order, OrderBy } from "../types";

export const useBlocks = (order: Order, orderBy: OrderBy) => {
  const cubic = useCubic();

  return useQuery(
    "blocks",
    async () => {
      const result = await cubic.getBlocks({
        order: { [order]: null },
        orderBy: { [orderBy]: null },
      } as BlocksRequest);
      return result;
    },
    {
      keepPreviousData: true,
      placeholderData: [],
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
