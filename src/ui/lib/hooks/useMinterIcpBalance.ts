import { Principal } from "@dfinity/principal";
import { useQuery } from "react-query";
import * as ledger from "../../declarations/ledger/index";
import { defaultAgent } from "../canisters";
import { accountForRecipient } from "../minter";

const anonLedger = ledger.createActor(defaultAgent);

export const useMinterIcpBalance = (recipient: string) => {
  let recipientPrincipal: Principal;
  try {
    recipientPrincipal = Principal.fromText(recipient);
  } catch (error) {}

  return useQuery(
    ["minterIcpBalance", recipient],
    async () => {
      const { accountId } = accountForRecipient(recipientPrincipal);
      const result = await anonLedger.account_balance_dfx({
        account: accountId,
      });
      return Number(result.e8s) / 1e8;
    },
    {
      enabled: !!recipientPrincipal,
      keepPreviousData: true,
      placeholderData: 0,
      refetchInterval: 1000,
    }
  );
};
