import { useMutation, useQueryClient } from "react-query";
import {
  useGlobalContext,
  useNotifications,
} from "../../components/Store/Store";
import { Response } from "../../declarations/Minter/Minter.did";
import { WrappedTcAsset } from "../types";

export default function useMint({
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
  const { add } = useNotifications();

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
      return (await res.json()) as Response;
    },
    {
      onError: (data) => {
        console.warn("mint error", data);
      },
      onSuccess: async (data) => {
        if ("Ok" in data) {
          add({
            type: "Mint",
            asset: token,
            amount: Number(data.Ok.amount) / 1e12,
          });
        }
        console.log("mint success", data);

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
