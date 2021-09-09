import { Principal } from "@dfinity/principal";
import React from "react";
import { Block, HistoryResponse } from "../../../declarations/Cubic/Cubic.did";
import { principalHash } from "../../../lib/blocks";

const generate = (p: Principal) => {
  const hash = principalHash(p);
  const color = `hsla(${hash % 360},100%,50%,50%)`;
  const arr = Array.from(p.toUint8Array());
  const start = { x: arr[0] % 48, y: arr[0] % 35, bit: arr[0] % 2 };
  const { polygons } = arr.reduce(
    (prev, n, i) => {
      let { x, y, bit, set, polygons } = prev;
      let magnitude = Math.ceil(n / 10);
      while (magnitude > 0) {
        if (n % 3 === 0) {
          if (bit === 0) {
            y--;
            bit = 1;
          } else {
            bit = 0;
          }
        } else if (n % 3 === 1) {
          if (bit === 0) {
            bit = 1;
          } else {
            x++;
            bit = 0;
          }
        } else if (n % 3 === 2) {
          if (bit === 0) {
            x--;
            bit = 1;
          } else {
            y++;
            bit = 0;
          }
        }
        const str = `${x},${y},${bit},${polygons.length}`;
        // if (!set.has(str)) {
        //   set.add(str);
        // }
        polygons.push(
          <polygon
            key={str}
            fill={i === 0 && n <= 50 ? "#000" : color}
            points={
              bit === 0
                ? `${x},${y} ${x + 1},${y} ${x},${y + 1}`
                : `${x + 1},${y} ${x + 1},${y + 1} ${x},${y + 1}`
            }
          />
        );
        magnitude--;
      }
      return { x, y, bit, set, polygons };
    },
    {
      ...start,
      set: new Set([`${start.x},${start.y},${start.bit},0`]),
      polygons: [],
    }
  );

  return polygons;
};

export function Triangles({
  owners,
  events,
}: {
  owners: Block[];
  events: HistoryResponse;
}) {
  if (!events?.events) return null;

  const count = 10;
  const inputs = owners
    .sort((a, b) => Number(a.totalOwnedTime - b.totalOwnedTime))
    .slice(-count);
  const cols = 48;
  const rows = 35;

  return (
    <svg className="max-w-lg w-full" viewBox={`0 0 ${100} ${100}`}>
      <defs>
        <clipPath id="clip">
          <rect x="5" y="5" width="90" height="90" />
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
          #_cubic004 .grid-line {
            stroke: rgba(0,0,0,0);
            stroke-width: .05;
          }
          #_cubic004 polygon {
            stroke: rgba(20,20,20,1);
            stroke-width: .2;
            stroke-linejoin: bevel;
          }
          `}
        </style>
      </defs>
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="#ebe4d8"
        filter="url(#shadow)"
      />

      <g id="_cubic004" clipPath="url(#clip)">
        <g
          transform={`translate(-48,4.5) scale(3) matrix(1 0 0.5 .866025404 0 0)`}
        >
          {inputs.map(({ owner }) => {
            return <g key={owner.toText()}>{generate(owner)}</g>;
          })}

          {Array.from({ length: rows }, (_, row) => (
            <path
              key={`row-${row}`}
              className="grid-line"
              d={`M 0 ${row} H${cols}`}
            />
          ))}
          {Array.from({ length: cols }, (_, col) => (
            <path
              key={`col-${col}`}
              className="grid-line"
              d={`M ${col} 0 V${rows}`}
            />
          ))}
        </g>
        <g
          transform={`translate(0,4.5) scale(3) matrix(1 0 -0.5 .866025404 0 0)`}
        >
          {Array.from({ length: cols + 2 }, (_, col) => (
            <path
              key={`col-${col}`}
              className="grid-line"
              d={`M ${col} 0 V${rows}`}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
