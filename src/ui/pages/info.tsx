import React from "react";
import Panel from "../components/Containers/Panel";

export default function InfoPage() {
  return (
    <div className="py-16">
      <Panel className="w-full p-8">
        <h1 className="text-3xl mb-4">What is Cubic?</h1>
        <p>Cubic is a generative art project that uses Harberger Taxes.</p>
        <p>Elements are dynamically added based on ownership.</p>
      </Panel>
    </div>
  );
}
