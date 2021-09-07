import React from "react";
import { ParsedSummary, TcAsset } from "../../lib/types";
import { useNotifications } from "../Store/Store";
import { Notification } from "./Notification";
import { PurchaseNotification } from "./PurchaseNotification";
import { SwapNotification } from "./SwapNotification";

export type NewSwapNotification =
  | {
      type: "Deposit";
      asset: TcAsset;
      amount: number;
    }
  | {
      type: "Withdraw";
      asset: TcAsset;
      amount: number;
    }
  | {
      type: "Mint";
      asset: TcAsset;
      amount: number;
    };
export type NewNotification =
  | NewSwapNotification
  | {
      type: "Sale";
      purchaser: ParsedSummary;
      myPurchase: ParsedSummary;
    }
  | {
      type: "Purchase";
    };
export type NotificationType = NewNotification & { id: string };

export const Notifications = () => {
  const { list, remove } = useNotifications();
  return (
    <div className="fixed z-50 top-8 right-8 flex flex-col gap-2">
      {list.map((item) => (
        <Notification
          key={item.id}
          handleClose={() => remove(item.id)}
          autoCloseDelay={
            item.type === "Deposit" ||
            item.type === "Withdraw" ||
            item.type === "Mint"
              ? 30_000
              : undefined
          }
        >
          {item.type === "Sale" && (
            <PurchaseNotification
              purchaser={item.purchaser}
              myPurchase={item.myPurchase}
            />
          )}
          {(item.type === "Deposit" ||
            item.type === "Withdraw" ||
            item.type === "Mint") && <SwapNotification data={item} />}
        </Notification>
      ))}
    </div>
  );
};
