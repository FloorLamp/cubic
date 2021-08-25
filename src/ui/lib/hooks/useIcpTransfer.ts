import { useMutation, useQueryClient } from "react-query";
import { useGlobalContext, useLedger } from "../../components/Store/Store";
import { FEE_AMOUNT } from "../constants";

export default function useIcpTransfer() {
  const queryClient = useQueryClient();
  const {
    state: { principal },
  } = useGlobalContext();
  const ledger = useLedger();

  return useMutation(
    "icpTransfer",
    async ({ amount, toAccount }: { amount: bigint; toAccount: string }) => {
      if (
        !window?.ic?.plug?.agent ||
        process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
      ) {
        const amountMinusFees = amount - FEE_AMOUNT;
        if (amountMinusFees <= BigInt(0)) {
          throw "Insufficient balance";
        }
        const height = await ledger.send_dfx({
          to: toAccount,
          amount: { e8s: amountMinusFees },
          fee: { e8s: FEE_AMOUNT },
          memo: BigInt(0),
          from_subaccount: [],
          created_at_time: [],
        });
        return height;
      } else {
        // window?.ic?.plug?.requestTransfer
      }
    },
    {
      onError: (data) => {
        console.warn(data);
      },
      onSuccess: async (data) => {
        queryClient.resetQueries(["icpBalance", principal.toText()]);
      },
    }
  );
}
