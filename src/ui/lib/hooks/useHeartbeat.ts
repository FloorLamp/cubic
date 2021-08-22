import { useMutation, useQueryClient } from "react-query";
import { useCubic } from "../../components/Store/Store";

export default function useHeartbeat() {
  const queryClient = useQueryClient();
  const cubic = useCubic();

  return useMutation("heartbeat", () => cubic.canister_heartbeat(), {
    onSuccess: async () => {
      queryClient.refetchQueries("art");
      queryClient.refetchQueries("blocks");
      queryClient.refetchQueries("status");
      queryClient.refetchQueries("history");
      queryClient.refetchQueries("info");
    },
  });
}
