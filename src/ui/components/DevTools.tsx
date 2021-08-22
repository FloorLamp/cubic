import React from "react";
import { Block } from "../declarations/Cubic/Cubic.did";
import { generateAdditional, generateBlocks } from "../lib/generate";
import { useArt } from "../lib/hooks/useArt";

export const DevTools = ({
  data,
  setData,
}: {
  data: Block[];
  setData: (arg: Block[]) => void;
}) => {
  const { data: art } = useArt();
  return (
    <div className="fixed z-10 bottom-0">
      <div className="p-2 flex gap-2 bg-black bg-opacity-50">
        <button className="btn-cta px-4 py-2" onClick={() => setData(art)}>
          Reset
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setData(generateAdditional(data));
          }}
        >
          Add 1
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setData(generateAdditional(data, 10));
          }}
        >
          Add 10
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setData(generateAdditional(data, 100));
          }}
        >
          Add 100
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setData(generateBlocks(100));
          }}
        >
          Roll 100
        </button>
      </div>
    </div>
  );
};
