import React, { useState } from "react";
import { Block } from "../declarations/Cubic/Cubic.did";
import { principalColor } from "../lib/blocks";
import { generateBlocks } from "../lib/generate";
import { useArt } from "../lib/hooks/useArt";
import Panel from "./Containers/Panel";

export default function Canvas() {
  const art = useArt();
  const [testData, setTestData] = useState(generateBlocks(30));
  const [isLive, setIsLive] = useState(false);

  return (
    <Panel className="p-8 w-full flex flex-col items-center">
      <Blocks data={isLive ? art.data : testData} />
      <div className="mt-4 flex gap-2">
        <button className="btn-cta px-4 py-2" onClick={() => setIsLive(true)}>
          Live
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setIsLive(false);
            setTestData(generateBlocks(400));
          }}
        >
          Generate
        </button>
      </div>
    </Panel>
  );
}

function Blocks({ data }: { data: Block[] }) {
  const maxWidth = Math.sqrt(
    Math.max(...data.map(({ totalOwnedTime }) => Number(totalOwnedTime) / 1e9))
  );

  return (
    <svg className="max-w-lg" viewBox={`0 0 ${maxWidth} ${data.length * 32}`}>
      {data.map(({ owner, totalOwnedTime, totalValue }, i) => {
        return (
          <rect
            key={owner.toText()}
            x="0"
            y={i * 32}
            width={Math.sqrt(Number(totalOwnedTime) / 1e9)}
            height="32"
            fill={principalColor(owner)}
          ></rect>
        );
      })}
    </svg>
  );
}
