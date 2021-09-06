import React from "react";
import { homeDescription, MetaTags } from "../components/MetaTags";
import { Preview } from "../components/Preview";

export default function Home() {
  const ids = 4;
  return (
    <div className="flex items-center gap-8 pt-8">
      <MetaTags
        title="cubic.place | Generative art on the IC"
        suffix={false}
        image="hero"
        description={homeDescription}
      />
      {Array.from({ length: ids }, (_, id) => (
        <Preview id={id.toString()} key={id} />
      ))}
    </div>
  );
}
