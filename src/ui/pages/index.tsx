import React from "react";
import { BlocksTable } from "../components/BlocksTable";
import { Canvas } from "../components/Canvas";
import { CurrentStatus } from "../components/CurrentStatus";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <Canvas />

      <BlocksTable />
      <CurrentStatus />
    </div>
  );
}
