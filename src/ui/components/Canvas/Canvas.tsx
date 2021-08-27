import React, { useState } from "react";
import { useArt } from "../../lib/hooks/useArt";
import useArtId from "../../lib/hooks/useArtId";
import Panel from "../Containers/Panel";
import { Art000 } from "./000";

export default function Canvas() {
  const artId = useArtId();
  const art = useArt({ artId });
  const [data, setData] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const actualData = isLive ? art.data : data;

  return (
    <Panel className="p-8 w-full flex flex-col items-center">
      {artId === "0" && actualData && <Art000 data={actualData} />}

      {/* <DevTools
        data={data}
        setData={setData}
        isLive={isLive}
        setIsLive={setIsLive}
      /> */}
    </Panel>
  );
}
