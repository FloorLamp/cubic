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
      const result = await ledger.account_balance_dfx({ account });
      return Number(result.e8s) / 1e8;
    },
    {
      enabled: !!user,
      refetchInterval: FIVE_SECONDS_MS,
    }
  );
};
