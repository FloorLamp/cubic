import { Principal } from "@dfinity/principal";
import {
  accountIdentifierFromSubaccount,
  padSubaccountArray,
} from "./accounts";

export const accountForRecipient = (recipient: Principal) => {
  const subaccount = padSubaccountArray(Array.from(recipient.toUint8Array()));
  return {
    subaccount,
    accountId: accountIdentifierFromSubaccount(
      Buffer.from(
        Principal.fromText(
          process.env.NEXT_PUBLIC_MINTER_PRINCIPAL
        ).toUint8Array()
      ),
      Buffer.from(subaccount)
    ),
  };
};
