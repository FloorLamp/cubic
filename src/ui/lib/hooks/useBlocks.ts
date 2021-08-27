import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { BlocksRequest } from "../../declarations/Cubic/Cubic.did";
import { ONE_MINUTES_MS } from "../constants";
import { Order, OrderBy } from "../types";

export const useBlocks = ({
  artId,
  order,
  orderBy,
}: {
  artId: string;
  order: Order;
  orderBy: OrderBy;
}) => {
  const cubic = useCubic();

  return useQuery(
    ["blocks", artId],
    async () => {
      const result = await cubic.getBlocks({
        artId: BigInt(artId),
        order: { [order]: null },
        orderBy: { [orderBy]: null },
      } as BlocksRequest);
      return result;
    },
    {
      enabled: !!artId,
      keepPreviousData: true,
      placeholderData: [],
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
