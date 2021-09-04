import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { dateTimeToNanos } from "../lib/datetime";
import { generate } from "../lib/generate";
import useInterval from "../lib/hooks/useInterval";
import { INITIAL_MOCK_STATE, useMockData } from "./Store/Store";

export const DevTools = () => {
  const [mockData, setMockData] = useMockData();
  const [isPlaying, setIsPlaying] = useState(false);
  useInterval(() => {
    if (isPlaying) {
      setMockData(generate(mockData));
    }
  }, 50);

  return (
    <div className="fixed z-10 bottom-0">
      <div className="p-2 flex gap-2 bg-black bg-opacity-50">
        <button
          className={classNames("btn-cta px-4 py-2", {
            "btn-cta": mockData.active,
            "btn-secondary": !mockData.active,
          })}
          onClick={() => {
            setMockData({
              ...mockData,
              active: false,
            });
          }}
        >
          Live
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setMockData({
              ...INITIAL_MOCK_STATE,
              active: true,
              now: dateTimeToNanos(DateTime.utc()),
            });
          }}
        >
          Reset
        </button>
        <button
          className={classNames("btn-cta px-4 py-2", {
            "btn-cta": !isPlaying,
            "btn-secondary": isPlaying,
          })}
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setMockData({ ...generate(mockData), active: true });
          }}
        >
          Add 1hr
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setMockData({ ...generate(mockData, 24), active: true });
          }}
        >
          Add 1d
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setMockData({ ...generate(mockData, 24 * 30), active: true });
          }}
        >
          Add 1mo
        </button>
        <button
          className="btn-cta px-4 py-2"
          onClick={() => {
            setMockData({
              ...generate(INITIAL_MOCK_STATE, 24 * 30),
              active: true,
            });
          }}
        >
          Roll 1mo
        </button>
      </div>
    </div>
  );
};
