import { useQuery } from "react-query";
import { FIVE_MINUTES_MS } from "../constants";

export const useAsset = ({ id }: { id: string }) => {
  return useQuery(["asset", id], () => Math.random().toString(), {
    refetchInterval: FIVE_MINUTES_MS,
  });
};
