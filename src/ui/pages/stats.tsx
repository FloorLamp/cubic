import React from "react";
import { MetaTags } from "../components/MetaTags";
import { Stats } from "../components/Stats";

export default function StatsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 py-8 gap-8">
      <MetaTags title="Stats" description="Stats for the Cubic project" />
      <Stats />
    </div>
  );
}
