import { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "react-query";
import { useCubic, useXtc } from "../../components/Store/Store";
import { canisterId } from "../../declarations/Cubic";
import { errorToString } from "../utils";

export default function useXtcDeposit() {
  const queryClient = useQueryClient();
  const cubic = useCubic();
  const xtc = useXtc();

  return useMutation(
    "xtcDeposit",
    async (tcAmount: number) => {
      const amount = BigInt(tcAmount * 1e12);
      const transfer = await xtc.transfer({
        to: Principal.fromText(canisterId),
        amount,
      });
      if ("Ok" in transfer) {
        const mint = await cubic.mint(amount);
        return transfer.Ok;
      } else {
        throw errorToString(transfer.Err);
      }
    },
    {
      onSuccess: async (data) => {
        queryClient.refetchQueries("cubesBalance");
        queryClient.refetchQueries("xtcBalance");
      },
    }
  );
}
