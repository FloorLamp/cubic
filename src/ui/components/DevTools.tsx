import classNames from "classnames";
import React from "react";
import { Block } from "../declarations/Cubic/Cubic.did";
import { generateAdditional, generateBlocks } from "../lib/generate";
import { useArt } from "../lib/hooks/useArt";
import useArtId from "../lib/hooks/useArtId";

export const DevTools = ({
  data,
  setData,
  isLive,
  setIsLive,
}: {
  data: Block[];
  setData: (arg: Block[]) => void;
  isLive: boolean;
  setIsLive: (arg: boolean) => void;
}) => {
  const artId = useArtId();
  const { data: art } = useArt({ artId });
  return (
    <div className="fixed z-10 bottom-0">
      <div className="p-2 flex gap-2 bg-black bg-opacity-50">
        <button
          className={classNames("btn-cta px-4 py-2", {
            "btn-cta": !isLive,
            "btn-secondary": isLive,
          })}
          onClick={() => {
            setIsLive(true);
            setData(art);
          }}
        >
          Live
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setIsLive(false);
            setData(generateAdditional(data));
          }}
        >
          Add 1
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setIsLive(false);
            setData(generateAdditional(data, 10));
          }}
        >
          Add 10
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setIsLive(false);
            setData(generateAdditional(data, 100));
          }}
        >
          Add 100
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setIsLive(false);
            setData(generateBlocks(100));
          }}
        >
          Roll 100
        </button>
      </div>
    </div>
  );
};
