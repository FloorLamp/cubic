import dynamic from "next/dynamic";
import React from "react";
import Panel from "../../../components/Containers/Panel";
import { CurrentStatus } from "../../../components/CurrentStatus";
import { History } from "../../../components/History";
import { MetaTags } from "../../../components/MetaTags";
import Breadcrumbs from "../../../components/Navigation/Breadcrumbs";
import { padProjectId } from "../../../lib/blocks";
import { useDetails } from "../../../lib/hooks/useDetails";

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
  const { data } = useDetails({ id });
  const paddedId = padProjectId(id);

  return (
    <>
      <MetaTags
        title={`Project ${paddedId}`}
        description={`Project ${paddedId} on cubic.place`}
      />
      <Breadcrumbs path={[{ path: `p/${id}`, label: `Project ${paddedId}` }]} />
      <div className="flex flex-col items-center gap-8 pt-8">
        <CanvasContainer />

        <Panel className="w-full p-8">
          <h1 className="text-2xl">
            {data && data[0] ? `${paddedId} — ${data[0].name}` : "—"}
          </h1>
          <p>{data && data[0]?.description}</p>
        </Panel>

        <div className="w-full flex flex-col lg:flex-row gap-8">
          <CurrentStatus />
          <History isPreview={true} />
        </div>
      </div>
    </>
  );
}
