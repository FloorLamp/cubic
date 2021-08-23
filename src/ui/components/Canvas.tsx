import React, { useState } from "react";
import { Block } from "../declarations/Cubic/Cubic.did";
import { blockColor } from "../lib/blocks";
import { useArt } from "../lib/hooks/useArt";
import Panel from "./Containers/Panel";

export default function Canvas() {
  const art = useArt();
  const [data, setData] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const actualData = isLive ? art.data : data;

  return (
    <Panel className="p-8 w-full flex flex-col items-center">
      <Blocks data={actualData} />

      {/* <DevTools
        data={data}
        setData={setData}
        isLive={isLive}
        setIsLive={setIsLive}
      /> */}
    </Panel>
  );
}

function Blocks({ data }: { data: Block[] }) {
  const inputs = data.map((d) => ({
    ...d,
    color: blockColor(d),
    size: Number(d.totalOwnedTime) / 1e9,
    start: 0,
  }));
  const sumSize = inputs.reduce((sum, { size }) => sum + size, 0);
  const totalLength = 720;
  const scale = totalLength / sumSize;
  let pos = 0;
  for (const element of inputs) {
    element.size *= scale;
    element.start = pos;
    pos += element.size;
  }
  const fullScaleOwnerCount = 1000;
  const minCubeScale = 0.5;
  const cubeScale =
    (Math.min(inputs.length, fullScaleOwnerCount) / fullScaleOwnerCount) *
      (1 - minCubeScale) +
    minCubeScale;
  const translate = ((1 - cubeScale) * 80) / 2 + 10;

  return (
    <svg className="max-w-lg" viewBox={`0 0 100 100`}>
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
          #_cubic-segments polyline {
            fill: none;
            stroke-width: 9;
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

      <g
        id="_cubic-segments"
        transform={`translate(${translate},${translate})scale(${cubeScale})`}
      >
        {inputs.map(({ owner, color, size, start }, i) => {
          return (
            <polyline
              key={owner.toText()}
              points="-0.5 4 76 4 76 76 4 76 4 13 67 13 67 67 13 67 13 22 58 22 58 58 22 58 22 31 49 31 49 49 31 49 31 40 45 40"
              strokeDasharray={
                start === 0
                  ? `${start + size},${totalLength}`
                  : `0,${start},${totalLength}`
              }
              stroke={color}
            />
          );
        })}
      </g>
    </svg>
  );
}
