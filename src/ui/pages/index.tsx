import React from "react";
import { Preview } from "../components/Preview";

export default function Home() {
  const ids = 2;
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      {Array.from({ length: ids }, (_, artId) => (
        <Preview artId={artId.toString()} key={artId} />
      ))}
    </div>
  );
}
