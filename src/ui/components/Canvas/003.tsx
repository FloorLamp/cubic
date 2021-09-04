import React from "react";
import { HistoryResponse } from "../../declarations/Cubic/Cubic.did";
import { principalColor } from "../../lib/blocks";

export function Art003({ data }: { data: HistoryResponse }) {
  if (!data?.transfers) return null;

  const count = 20;
  const recentTransfers = data.transfers.slice(-count);

  const dx = 1.5;
  const height = 15;
  const inputs = recentTransfers.map((d, i) => {
    const arr = d.to.toUint8Array();
    let dir = 1;
    const qs = Array.from(arr, (n, i) => {
      dir = i === 0 ? (n - 128 < 0 ? -1 : 1) : -dir;
      const y = Math.abs(((n - 128) / 256) * height * 3) * dir;

      return `q ${dx} ${y},${dx * 2} ${0} q ${dx / 2} ${-y / 3}, ${dx} ${0} q ${
        dx / 2
      } ${y / 2}, ${dx} ${0}`;
    }).join(" ");

    return {
      ...d,
      color: principalColor(d.to),
      path: `M0 ${i * height * 0.25} h10 ${qs} h10`,
      strokeWidth: i * 0.005 + 0.05,
    };
  });
  const side = 100;

  return (
    <svg className="max-w-lg w-full" viewBox={`0 0 ${side} ${side}`}>
      <defs>
        <clipPath id="clip">
          <rect x="5" y="0" width="90" height="95" />
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
          #_cubic002 .path {
            fill: none;
            stroke-dasharray: .2 .8;
            animation: dash 5s linear infinite;
          }
          @keyframes dash {
            0% {
              stroke-dashoffset: 1;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          `}
        </style>
        {inputs.map(({ to, color }, i) => {
          const key = to.toText();
          return (
            <linearGradient
              key={key + i}
              id={`gradient-${key}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          );
        })}
      </defs>
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="#333"
        filter="url(#shadow)"
      />

      <g clipPath="url(#clip)">
        <g id="_cubic002" transform={`translate(10,10)scale(0.8)`}>
          {inputs.map(({ id, to, path, strokeWidth }, i) => {
            const key = to.toText();
            return (
              <g
                key={id.toString()}
                transform={`translate(${(count - i) * 1.5}, 15)`}
              >
                <path
                  d={path + ` v${height} h${-side} z`}
                  stroke="none"
                  fill="#333"
                />
                <path
                  d={path}
                  strokeWidth={strokeWidth}
                  stroke={`url(#gradient-${key})`}
                  id={`path-${key}`}
                  className="path"
                  pathLength="1"
                />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
