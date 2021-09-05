import dynamic from "next/dynamic";
import React from "react";
import Panel from "../../../components/Containers/Panel";
import { CurrentStatus } from "../../../components/CurrentStatus";
import { History } from "../../../components/History";
import { cubicName } from "../../../lib/blocks";
import { useArt } from "../../../lib/hooks/useArt";
import useArtId from "../../../lib/hooks/useArtId";

const CanvasContainer = dynamic(
  () => import("../../../components/Canvas/Canvas"),
  {
    ssr: false,
  }
);

export default function ArtById() {
  const artId = useArtId();
  const { data: art } = useArt({ artId });

  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <CanvasContainer />

      <Panel className="w-full p-8">
        <h1 className="text-2xl">
          {artId && cubicName(artId)}
          {" — "}
          {art ? art[0]?.name : "—"}
        </h1>
        <p>{art ? art[0]?.description : "—"}</p>
      </Panel>

      <div className="w-full flex flex-col lg:flex-row gap-8">
        <CurrentStatus />
        <History isPreview={true} />
      </div>
    </div>
  );
}
