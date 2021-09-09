import React from "react";
import { HistoryResponse } from "../../../declarations/Cubic/Cubic.did";
import { principalHash } from "../../../lib/blocks";
import { dateTimeFromNanos } from "../../../lib/datetime";
import { transfersFromEvents } from "../../../lib/utils";

export function Sweeper({
  events,
  now,
}: {
  events: HistoryResponse;
  now: bigint;
}) {
  if (!events?.events) return null;

  const count = 12;
  const recentTransfers = transfersFromEvents(events.events).slice(-count);

  const dt = dateTimeFromNanos(now).toUTC();
  const hourOffset = 30 * ((dt.hour % 12) + dt.minute / 60);

  const inputs = recentTransfers.map((d, i) => {
    const id = d.id.toString();
    const hash = principalHash(d.to);
    const color = `hsla(${hash % 360},${
      100 - (recentTransfers.length - 1 - i) * (95 / 11)
    }%,${50 - (recentTransfers.length - 1 - i) * (30 / 11)}%,100%)`;
    const arr = d.to.toUint8Array();

    let y = 5;
    const circles = Array.from(arr, (n, byte) => {
      const width = (byte + 1) * 2;
      const height = n / 100;
      const rect = (
        <rect
          key={"rect" + byte}
          width={width}
          height={height}
          x={-width}
          y={-(y + height)}
          fill={`url(#bg-${id})`}
        />
      );
      y += height / 2;
      const circle = (
        <circle
          key={"circle" + byte}
          cx={0}
          cy={-y}
          r={height / 2}
          fill={color}
        />
      );
      y += height / 2 + 2;
      return [circle, rect];
    })
      .concat(
        i === count - 1
          ? [
              <circle
                key="c"
                id="c"
                cx={0}
                cy={0}
                r={2.5}
                fill="rgba(0,0,0,.2)"
                stroke={color}
                strokeWidth={0.5}
              />,
            ]
          : []
      )
      .flat();

    return {
      group: (
        <g key={id} transform={`rotate(${30 * i + hourOffset + 30})`}>
          <defs>
            <linearGradient id={`bg-${id}`} x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          {circles}
        </g>
      ),
    };
  });

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
        <radialGradient id="bg">
          <stop offset="10%" stopColor="#282828" />
          <stop offset="100%" stopColor="#0f0f0f" />
        </radialGradient>
      </defs>
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="url(#bg)"
        filter="url(#shadow)"
      />

      <g clipPath="url(#clip)">
        <g id="_cubic005" transform="translate(50,50)">
          {inputs.map(({ group }) => group)}
        </g>
      </g>
    </svg>
  );
}
