import { DateTime } from "luxon";
import dynamic from "next/dynamic";
import React from "react";
import EditProjectButton from "../../../components/Admin/EditProjectButton";
import Panel from "../../../components/Containers/Panel";
import { CurrentStatus } from "../../../components/CurrentStatus";
import { History } from "../../../components/History";
import { MetaTags } from "../../../components/MetaTags";
import Breadcrumbs from "../../../components/Navigation/Breadcrumbs";
import { padProjectId } from "../../../lib/blocks";
import { useSummary } from "../../../lib/hooks/useSummary";

const CanvasContainer = dynamic(
  () => import("../../../components/Canvas/Canvas"),
  {
    ssr: false,
  }
);

export async function getServerSideProps({ params }) {
  const { id } = params;
  if (!id || isNaN(Number(id))) {
    return { notFound: true };
  }
  return { props: { id } };
}

export default function ProjectPage({ id }: { id: string }) {
  const data = useSummary({ id });
  const paddedId = padProjectId(id);

  return (
    <>
      <MetaTags
        title={`Project ${paddedId}`}
        description={`Project ${paddedId} on cubic.place`}
      />
      <div className="xs:flex justify-between items-center">
        <Breadcrumbs
          path={[{ path: `p/${id}`, label: `Project ${paddedId}` }]}
        />
        <EditProjectButton id={id} />
      </div>
      <div className="flex flex-col items-center gap-8 pt-8">
        <CanvasContainer />

        <Panel className="w-full p-8">
          <h1 className="text-2xl">
            {data ? `${paddedId} — ${data.details.name}` : "—"}
          </h1>
          <p>{data?.details.description}</p>
          {data && (
            <p className="text-gray-500 mt-4">
              {data.details.creator || "Unknown"} •{" "}
              {data.details.createdTime
                ? DateTime.fromSeconds(Number(data.details.createdTime)).year
                : null}
            </p>
          )}
        </Panel>

        <div className="w-full flex flex-col lg:flex-row gap-8">
          <CurrentStatus />
          <History isPreview={true} />
        </div>
      </div>
    </>
  );
}
