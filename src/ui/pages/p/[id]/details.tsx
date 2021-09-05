import React from "react";
import { History } from "../../../components/History";
import { MetaTags } from "../../../components/MetaTags";
import Breadcrumbs from "../../../components/Navigation/Breadcrumbs";
import { OwnersTable } from "../../../components/OwnersTable";
import { padProjectId } from "../../../lib/blocks";

export async function getServerSideProps({ params }) {
  const { id } = params;
  if (!id || isNaN(Number(id))) {
    return { notFound: true };
  }
  return { props: { id } };
}

export default function OwnersPage({ id }: { id: string }) {
  const paddedId = padProjectId(id);
  return (
    <>
      <MetaTags
        title={`Project ${paddedId} Details`}
        description={`Details for Project ${paddedId} on cubic.place`}
      />
      <Breadcrumbs
        path={[
          { path: `p/${id}`, label: `Project ${paddedId}` },
          {
            path: `/details`,
            label: "Details",
          },
        ]}
      />
      <div className="flex flex-col items-center gap-8 pt-8">
        <OwnersTable />

        <History />
      </div>
    </>
  );
}
