import { Principal } from "@dfinity/principal";
import { useQuery } from "react-query";
import { useGlobalContext, useLedger } from "../../components/Store/Store";
import { accountIdentifierFromSubaccount } from "../accounts";
import { FIVE_SECONDS_MS } from "../constants";

export const useIcpBalance = (user_?: Principal) => {
  const ledger = useLedger();
  const {
    state: { principal },
  } = useGlobalContext();
  const user = user_ ?? principal;

  const account = user
    ? accountIdentifierFromSubaccount(
        Buffer.from(user.toUint8Array()),
        Buffer.from(Array.from({ length: 32 }, () => 0))
      )
    : null;

  return useQuery(
    ["icpBalance", user?.toText()],
    async () => {
      if (
        window?.ic?.plug?.agent &&
        process.env.NEXT_PUBLIC_DFX_NETWORK !== "local"
      ) {
        const result = await window.ic.plug.requestBalance();
        const balance = result.find(({ symbol }) => symbol === "ICP");
        if (balance) {
          return balance.amount;
        } else {
          console.log(result);
          throw "ICP balance not found";
        }
      } else {
        const result = await ledger.account_balance_dfx({ account });
        return Number(result.e8s) / 1e8;
      }
    },
    {
      enabled: !!user,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
