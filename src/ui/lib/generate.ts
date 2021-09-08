import { Principal } from "@dfinity/principal";
import { INITIAL_MOCK_STATE, State } from "../components/Store/Store";
import { canisterId } from "../declarations/Cubic";
import { ParsedSummary } from "./types";
import { principalIsEqual } from "./utils";

function randomNormal(min: number, max: number, skew: number = 1) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) num = randomNormal(min, max, skew);
  else {
    num = Math.pow(num, skew);
    num *= max - min;
    num += min;
  }
  return num;
}

export const randomPrincipal = () => {
  const array = new Uint8Array(29);
  typeof window !== "undefined" && window.crypto.getRandomValues(array);
  return Principal.fromUint8Array(array);
};

export const generate = (
  { active, events, art, status, now }: State["mockData"] = INITIAL_MOCK_STATE,
  count: number = 1
): State["mockData"] => {
  let i = 0;
  let newEvents = events.events;
  let newArt = art;
  let newNow = now;

  let newOwner, newTransfer;
  let newStatus: ParsedSummary = status;

  while (i < count) {
    let newTimeDiff: bigint;
    if (newArt.length > 0 && Math.random() < 0.95) {
      // Pass 1 hour only
      newTimeDiff = BigInt(60 * 60 * 1e9);
      newNow += newTimeDiff;
    } else {
      newTimeDiff = BigInt(Math.floor(Math.random() * 60 * 60) * 1e9);
      newNow += newTimeDiff;

      const isNew = newEvents.length === 0;
      const isExistingOwner = Math.random() < 0.5 && art.length > 1;
      let idx;

      if (isExistingOwner) {
        do {
          idx = Math.floor(Math.random() * art.length);
          newOwner = art[idx].owner;
        } while (
          principalIsEqual(
            newOwner,
            events.events[events.events.length - 1].data["Transfer"].to
          )
        );
      } else {
        newOwner = randomPrincipal();
      }

      newTransfer = {
        id: BigInt(newEvents.length),
        timestamp: newNow,
        data: {
          Transfer: {
            to: newOwner,
            from: isNew
              ? Principal.fromText(canisterId)
              : newEvents[newEvents.length - 1].data["Transfer"].to,
            value: BigInt(Math.floor(randomNormal(1, 100)) * 1e12),
          },
        },
      };
      console.log({ newTransfer });

      newEvents = newEvents.concat(newTransfer);

      if (isExistingOwner) {
        const {
          id,
          owner,
          totalSaleCount,
          totalOwnedTime,
          totalValue,
          lastSalePrice,
        } = newArt[idx];
        newArt = newArt
          .slice(0, idx)
          .concat({
            id,
            owner,
            totalSaleCount,
            lastPurchasePrice: newTransfer.value,
            lastSaleTime: newTransfer.timestamp,
            lastSalePrice,
            totalValue: totalValue + newTransfer.value,
            totalOwnedTime: totalOwnedTime,
          })
          .concat(newArt.slice(idx + 1));
      } else {
        newArt = newArt.concat({
          id: BigInt(newArt.length),
          owner: newOwner,
          totalSaleCount: BigInt(0),
          lastPurchasePrice: newTransfer.value,
          lastSaleTime: BigInt(0),
          lastSalePrice: BigInt(0),
          totalValue: newTransfer.value,
          totalOwnedTime: newTimeDiff,
        });
      }
    }

    if (newOwner) {
      newStatus = {
        projectId: status.projectId,
        status: {
          owner: newOwner,
          offerTimestamp: newTransfer.timestamp,
          offerValue: Math.floor(randomNormal(1, 100)),
          isForeclosed: false,
        },
        owner: null,
        details: null,
      };
    }

    const ownerIdx = newArt.findIndex(({ owner }) =>
      principalIsEqual(owner, newStatus.status.owner)
    );

    // Increase current owner time
    newArt = newArt
      .slice(0, ownerIdx)
      .concat({
        ...newArt[ownerIdx],
        totalOwnedTime: newArt[ownerIdx].totalOwnedTime + newTimeDiff,
      })
      .concat(newArt.slice(ownerIdx + 1));

    i++;
  }

  return {
    active,
    events: { events: newEvents, count: BigInt(newEvents.length) },
    art: newArt,
    status: newStatus,
    now: newNow,
  };
};
