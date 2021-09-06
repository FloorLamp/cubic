import { useQuery } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { BlocksRequest } from "../../declarations/Cubic/Cubic.did";
import { ONE_MINUTES_MS } from "../constants";
import { Order, OrderBy } from "../types";

export const useBlocks = ({
  id,
  order,
  orderBy,
}: {
  id: string;
  order: Order;
  orderBy: OrderBy;
}) => {
  const cubic = useCubic();

  return useQuery(
    ["blocks", id],
    async () => {
      const result = await cubic.getBlocks({
        projectId: BigInt(id),
        order: { [order]: null },
        orderBy: { [orderBy]: null },
      } as BlocksRequest);
      return result;
    },
    {
      enabled: !!id,
      keepPreviousData: true,
      placeholderData: [],
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
