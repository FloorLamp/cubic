import dynamic from "next/dynamic";
import React from "react";
import Panel from "../../../components/Containers/Panel";
import { CurrentStatus } from "../../../components/CurrentStatus";
import { History } from "../../../components/History";
import { cubicDescriptions, cubicName } from "../../../lib/blocks";
import useArtId from "../../../lib/hooks/useArtId";

const CanvasContainer = dynamic(
  () => import("../../../components/Canvas/Canvas"),
  {
    ssr: false,
  }
);

export default function ArtById() {
  const artId = useArtId();

  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <CanvasContainer />

      <Panel className="w-full p-8">
        <h1 className="text-2xl">{artId && cubicName(artId)}</h1>
        <p>{cubicDescriptions[artId]}</p>
      </Panel>

      <div className="w-full flex flex-col lg:flex-row gap-8">
        <CurrentStatus />
        <History isPreview={true} />
      </div>
    </div>
  );
}
