import { Principal } from "@dfinity/principal";
import { Block } from "../declarations/Cubic/Cubic.did";

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
  const array = new Uint8Array(8);
  typeof window !== "undefined" && window.crypto.getRandomValues(array);
  return Principal.fromUint8Array(array);
};

export const generateBlocks = (length = 100): Block[] => {
  return Array.from({ length }, (_, i) => {
    return {
      id: BigInt(i),
      totalValue: BigInt(Math.floor(randomNormal(1, 2000, 5)) * 1e12),
      totalOwnedTime: BigInt(Math.floor(randomNormal(0, 86_400 * 60, 5)) * 1e9),
      owner: randomPrincipal(),
    };
  });
};

export const generateAdditional = (data: Block[], count: number = 1) => {
  let i = 0;
  let d = data;
  while (i < count) {
    if (Math.random() < 0.5) {
      const idx = Math.floor(Math.random() * d.length);
      const { id, owner, totalOwnedTime, totalValue } = d[idx];
      d = d
        .slice(0, idx)
        .concat({
          id,
          owner,
          totalValue:
            totalValue + BigInt(Math.floor(randomNormal(1, 100)) * 1e12),
          totalOwnedTime:
            totalOwnedTime + BigInt(Math.floor(randomNormal(0, 86_400)) * 1e9),
        })
        .concat(d.slice(idx + 1));
    } else {
      d = d.concat({
        id: BigInt(d.length),
        totalValue: BigInt(Math.floor(randomNormal(1, 100)) * 1e12),
        totalOwnedTime: BigInt(Math.floor(randomNormal(0, 86_400)) * 1e9),
        owner: randomPrincipal(),
      });
    }
    i++;
  }
  return d;
};
