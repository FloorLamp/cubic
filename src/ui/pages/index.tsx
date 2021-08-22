import dynamic from "next/dynamic";
import React from "react";
import { BlocksTable } from "../components/BlocksTable";
import { CurrentStatus } from "../components/CurrentStatus";

const CanvasContainer = dynamic(() => import("../components/Canvas"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <CanvasContainer />

      <CurrentStatus />

      <BlocksTable />
    </div>
  );
}
