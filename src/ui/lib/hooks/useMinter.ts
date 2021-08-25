import { useMutation, useQueryClient } from "react-query";
import { useGlobalContext } from "../../components/Store/Store";
import { WrappedTcAsset } from "../types";

export default function useMinter({
  token,
  recipient,
}: {
  token: WrappedTcAsset;
  recipient: string;
}) {
  const queryClient = useQueryClient();
  const {
    state: { principal },
  } = useGlobalContext();

  return useMutation(
    "mint",
    async () => {
      const res = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          recipient,
        }),
      });
      return await res.json();
    },
    {
      onError: (data) => {
        console.warn(data);
      },
      onSuccess: async (data) => {
        console.log(data);

        queryClient.resetQueries(["icpBalance", principal.toText()]);
        if (token === "WTC") {
          queryClient.resetQueries("wtcBalance");
        } else {
          queryClient.resetQueries("xtcBalance");
        }
      },
    }
  );
}
