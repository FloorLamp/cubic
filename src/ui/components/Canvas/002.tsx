import React from "react";
import { HistoryResponse } from "../../declarations/Cubic/Cubic.did";
import { principalColor } from "../../lib/blocks";

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export function Art002({ data, now }: { data: HistoryResponse; now: bigint }) {
  if (!data) return null;

  const startIndex = Math.max(
    0,
    data.transfers.findIndex(
      ({ timestamp }) => timestamp >= now - BigInt(ONE_YEAR_SECONDS * 1e9)
    ) - 1
  );
  const mostRecent = [...data.transfers.slice(startIndex)].reverse();

  const inputs = mostRecent.map((d, i) => {
    const seconds =
      Number((i === 0 ? now : mostRecent[i - 1].timestamp) - d.timestamp) / 1e9;
    return {
      ...d,
      seconds,
      color: principalColor(d.to),
      parts: [],
    };
  });
  const side = 100;
  const rows = 52;
  const height = side / rows;
  const totalLength = rows * side;
  let x = 0;
  let row = 0;
  for (const element of inputs) {
    let rem = (element.seconds / ONE_YEAR_SECONDS) * totalLength;
    while (rem > 0 && row < rows) {
      const width = Math.min(rem, side - x);
      element.parts.push({ x, width, y: row * height });
      rem -= width;
      x += width;
      if (x >= side) {
        x = 0;
        row++;
      }
    }
  }

  return (
    <svg className="max-w-lg w-full" viewBox={`0 0 ${100} ${100}`}>
      <defs>
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
          #_cubic002 rect {
            stroke-width: 1.5;
            stroke: #000;
          }
          `}
        </style>
      </defs>
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="#333"
        filter="url(#shadow)"
      />

      <g id="_cubic002" transform={`translate(10,10)scale(0.8)`}>
        {inputs.flatMap(({ id, to, color, parts }) => {
          return parts.map(({ x, width, y }, i) => (
            <rect
              key={`${id}-${i}`}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={color}
            />
          ));
        })}
      </g>
    </svg>
  );
}
