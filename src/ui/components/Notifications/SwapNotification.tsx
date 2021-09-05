import React from "react";
import { TokenLogo } from "../Labels/TokenLabel";
import { NewSwapNotification } from "./Notifications";

export const SwapNotification = ({ data }: { data: NewSwapNotification }) => {
  return (
    <div className="flex items-start">
      <div className="w-6 h-6 flex items-center justify-center">
        <TokenLogo />
      </div>
      <div>
        <strong className="block">{data.type} Success!</strong>
        {data.type === "Mint" && (
          <>
            Minted {data.amount} {data.asset}
          </>
        )}
        {data.type === "Deposit" && (
          <>
            Swapped {data.amount} {data.asset} for {data.amount} CUBE
          </>
        )}
        {data.type === "Withdraw" && (
          <>
            Swapped {data.amount} CUBE for {data.amount} {data.asset}
          </>
        )}
      </div>
    </div>
  );
};
