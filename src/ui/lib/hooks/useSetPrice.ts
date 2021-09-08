import { useMutation, useQueryClient } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { errorToString } from "../utils";

export default function useSetPrice({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const cubic = useCubic();

  return useMutation(
    ["setPrice", id],
    async (newOffer: bigint) => {
      const result = await cubic.setPrice({ projectId: BigInt(id), newOffer });
      if ("ok" in result) {
        return result.ok;
      }
      throw errorToString(result.err);
    },
    {
      onSuccess: async (data) => {
        queryClient.resetQueries("cubesBalance");
        queryClient.refetchQueries("allSummary");
        queryClient.refetchQueries("info");
        queryClient.refetchQueries(["details", id]);
        queryClient.refetchQueries(["owners", id]);
        queryClient.refetchQueries(["history", id]);
      },
    }
  );
}
