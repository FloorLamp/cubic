import { IDL } from "@dfinity/candid";
import { decode, encode, Nat } from "@dfinity/candid/lib/cjs/idl";
import { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "react-query";
import { useGlobalContext, useXtc } from "../../components/Store/Store";
import { canisterId } from "../../declarations/Cubic";

export default function useXtcDeposit() {
  const {
    state: { principal },
  } = useGlobalContext();
  const queryClient = useQueryClient();
  const xtc = useXtc();

  return useMutation(
    "xtcDeposit",
    async (tcAmount: number) => {
      const cycles = BigInt(tcAmount * 1e12);
      const result = await xtc.wallet_call({
        canister: Principal.fromText(canisterId),
        args: Array.from(encode([IDL.Principal], [principal])),
        method_name: "depositWtc",
        cycles,
      });
      if ("Ok" in result) {
        const decoded = decode([Nat], Buffer.from(result.Ok.return) as any);
        return decoded;
      } else {
        throw result.Err;
      }
    },
    {
      onSuccess: async (data) => {
        queryClient.resetQueries("cubesBalance");
        queryClient.resetQueries("xtcBalance");
      },
    }
  );
}
