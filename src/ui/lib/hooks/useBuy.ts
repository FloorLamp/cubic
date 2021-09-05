import { useMutation, useQueryClient } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { errorToString } from "../utils";

export default function useBuy({ artId }: { artId: string }) {
  const queryClient = useQueryClient();
  const cubic = useCubic();

  return useMutation(
    "buy",
    async (newOffer: bigint) => {
      const result = await cubic.buy({ artId: BigInt(artId), newOffer });
      if ("ok" in result) {
        return result.ok;
      } else {
        if ("InsufficientBalance" in result.err) {
          queryClient.refetchQueries("status");
        }
        throw errorToString(result.err);
      }
    },
    {
      onSuccess: async (data) => {
        queryClient.resetQueries("cubesBalance");
        queryClient.refetchQueries(["art", artId]);
        queryClient.refetchQueries(["blocks", artId]);
        queryClient.refetchQueries(["status", artId]);
        queryClient.refetchQueries(["history", artId]);
        queryClient.refetchQueries("info");
      },
    }
  );
}
