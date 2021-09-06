import { useMutation, useQueryClient } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { errorToString } from "../utils";

export default function useBuy({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const cubic = useCubic();

  return useMutation(
    "buy",
    async (newOffer: bigint) => {
      const result = await cubic.buy({ projectId: BigInt(id), newOffer });
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
        queryClient.refetchQueries(["details", id]);
        queryClient.refetchQueries(["blocks", id]);
        queryClient.refetchQueries(["status", id]);
        queryClient.refetchQueries(["history", id]);
        queryClient.refetchQueries("info");
      },
    }
  );
}
