import React from "react";
import NewProjectButton from "../components/Admin/NewProjectButton";
import { Preview } from "../components/Canvas/Preview";
import { homeDescription, MetaTags } from "../components/MetaTags";
import Breadcrumbs from "../components/Navigation/Breadcrumbs";
import { useAllSummary } from "../lib/hooks/useAllSummary";
import { useIsController } from "../lib/hooks/useIsController";

export default function Home() {
  const allSummary = useAllSummary();
  const isController = useIsController();

  return (
    <>
      <MetaTags
        title="cubic.place | Generative art on the IC"
        suffix={false}
        image="hero"
        description={homeDescription}
      />
      <div className="xs:flex justify-between items-center">
        <Breadcrumbs path={[]} />
        <NewProjectButton />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-8">
        {allSummary.data?.map(({ projectId, details }) => {
          if (details && !details.isActive && !isController) {
            return null;
          }

          return <Preview id={projectId} key={projectId} />;
        })}
      </div>
    </>
  );
}
