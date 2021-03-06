import { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "react-query";
import {
  useGlobalContext,
  useNotifications,
  useWtc,
} from "../../components/Store/Store";
import { canisterId } from "../../declarations/Cubic";
import { extErrorToString } from "../utils";

export default function useWtcDeposit() {
  const {
    state: { principal },
  } = useGlobalContext();
  const queryClient = useQueryClient();
  const wtc = useWtc();
  const { add } = useNotifications();

  return useMutation(
    "wtcDeposit",
    async (tcAmount: number) => {
      const transfer = await wtc.transfer({
        from: { principal },
        to: { principal: Principal.fromText(canisterId) },
        amount: BigInt(tcAmount * 1e12),
        fee: BigInt(0),
        token: "WTC",
        memo: [],
        notify: true,
        subaccount: [],
      });
      if ("ok" in transfer) {
        return transfer.ok;
      } else {
        throw extErrorToString(transfer.err);
      }
    },
    {
      onSuccess: async (data, tcAmount) => {
        add({ type: "Deposit", asset: "WTC", amount: tcAmount });
        queryClient.resetQueries("cubesBalance");
        queryClient.resetQueries("wtcBalance");
      },
    }
  );
}
