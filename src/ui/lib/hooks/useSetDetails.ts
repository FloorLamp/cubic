import { useMutation, useQueryClient } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { SetDetailsRequest } from "../../declarations/Cubic/Cubic.did";

export default function useSetDetails({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const cubic = useCubic();

  return useMutation(
    ["setDetails", id],
    async (request: Omit<SetDetailsRequest, "projectId">) => {
      return await cubic.setDetails({ projectId: BigInt(id), ...request });
    },
    {
      onSuccess: async (data) => {
        queryClient.refetchQueries(["details", id]);
      },
    }
  );
}
