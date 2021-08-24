import { useMutation, useQueryClient } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { WithdrawRequest } from "../../declarations/Cubic/Cubic.did";
import { TcAsset } from "../types";
import { errorToString } from "../utils";

export default function useWithdraw() {
  const queryClient = useQueryClient();
  const cubic = useCubic();

  return useMutation(
    "withdraw",
    async ({ asset, tcAmount }: { asset: TcAsset; tcAmount: number }) => {
      const transfer = await cubic.withdraw({
        asset: { [asset]: null },
        amount: BigInt(tcAmount * 1e12),
      } as WithdrawRequest);
      if ("ok" in transfer) {
        return transfer.ok;
      } else {
        throw errorToString(transfer.err);
      }
    },
    {
      onError: (data) => {
        if (data === "InsufficientBalance") {
          queryClient.resetQueries("cubesBalance");
        }
      },
      onSuccess: async (data, { asset }) => {
        queryClient.resetQueries("cubesBalance");
        if (asset === "WTC") {
          queryClient.resetQueries("wtcBalance");
        } else {
          queryClient.resetQueries("xtcBalance");
        }
      },
    }
  );
}
