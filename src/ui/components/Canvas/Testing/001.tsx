import React from "react";
import { Block } from "../../../declarations/Cubic/Cubic.did";
import { principalHash } from "../../../lib/blocks";
import { ParsedStatus } from "../../../lib/types";
import { principalIsEqual } from "../../../lib/utils";

function groupBy<T>(
  xs: T[],
  key: string | ((x: any) => string)
): Record<string, T[]> {
  return xs.reduce((g, x) => {
    const val = typeof key === "function" ? key(x) : x[key];
    if (!g[val]) g[val] = [];
    g[val].push(x);
    return g;
  }, {});
}

function groupByArray<T>(xs: T[], key: string) {
  return Object.entries(groupBy(xs, key));
}

export function Art001({
  data,
  status,
}: {
  data: Block[];
  status: ParsedStatus;
}) {
  if (!status.status.owner) {
    return null;
  }

  const ownerBucket = principalHash(status.status.owner) % 9;
  const inputs = data
    .sort((a, b) => Number(b.totalOwnedTime - a.totalOwnedTime))
    .map((d) => {
      const bucket = principalHash(d.owner) % 9;
      return {
        ...d,
        bucket,
        size: Math.sqrt(Number(d.totalOwnedTime) / 1e9),
        stroke: null,
        fill: "none",
        isOwnerBucket: bucket === ownerBucket,
        isOwner: principalIsEqual(d.owner, status.status.owner),
      };
    });
  const d = 100;
  const groups = groupByArray(inputs, "bucket");

  const sorted = groups
    .filter(([bucket]) => bucket !== ownerBucket.toString())
    .concat([groups.find(([bucket]) => bucket === ownerBucket.toString())]);

  const generated = sorted.map(([bucket, items]) => {
    const max = Math.max(...items.map(({ size }) => size));
    const min = Math.min(...items.map(({ size }) => size));
    for (const item of items) {
      const pct = max === min ? 1 : (item.size - min) / (max - min);
      const l = item.isOwner ? 100 : pct * 45 + 5;
      const a = item.isOwner ? 100 : pct * 100;

      item.stroke = `hsla(${
        (item.bucket * (360 / 9) + 15) % 360
      },100%,${l}%,${a}%)`;
      item.size = ((pct * d) / 6) * (item.isOwnerBucket ? 2 : 0.95);
      console.log();

      if (item.isOwnerBucket && pct === 1) {
        item.fill = "#000";
      }
    }
    return [bucket, items] as const;
  });

  return (
    <svg className="max-w-lg w-full" viewBox={`0 0 ${100} ${100}`}>
      <defs>
        <clipPath id="clip">
          <rect x="0" y="0" width="100" height="100" />
        </clipPath>
        <filter id="shadow" x="0" y="0" width="175" height="200">
          <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
          <feColorMatrix
            result="matrixOut"
            in="offOut"
            type="matrix"
            values="0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.2 0"
          />
          <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="1" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
        <style>
          {`
          #_cubic001 circle {
            stroke-width: 0.2;
          }
          `}
        </style>
      </defs>
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="#0d0e0d"
        filter="url(#shadow)"
      />

      <g id="_cubic001" transform={`translate(5,5)scale(0.9)`}>
        {generated.flatMap(([_, items]) => {
          return items.map(({ owner, stroke, fill, size, bucket }, i) => {
            return (
              <circle
                key={owner.toText()}
                cx={(bucket % 3) * (d / 3) + d / 6}
                cy={Math.floor(bucket / 3) * (d / 3) + d / 6}
                r={size}
                fill={fill}
                stroke={stroke}
                clipPath="url(#clip)"
              />
            );
          });
        })}
      </g>
    </svg>
  );
}
