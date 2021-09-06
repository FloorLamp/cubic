import React from "react";
import { Preview } from "../components/Canvas/Preview";
import { homeDescription, MetaTags } from "../components/MetaTags";
import { useInfo } from "../lib/hooks/useInfo";

export default function Home() {
  const { data } = useInfo();
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 pt-8">
      <MetaTags
        title="cubic.place | Generative art on the IC"
        suffix={false}
        image="hero"
        description={homeDescription}
      />
      {data &&
        Array.from({ length: Number(data.projectCount) }, (_, id) => (
          <Preview id={id.toString()} key={id} />
        ))}
    </div>
  );
}
