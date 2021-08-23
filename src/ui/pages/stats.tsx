import React from "react";
import { Stats } from "../components/Stats";

export default function StatsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 py-8 gap-8">
      <Stats />
    </div>
  );
}
