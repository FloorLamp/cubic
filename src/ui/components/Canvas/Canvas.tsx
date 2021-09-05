import { DateTime } from "luxon";
import React from "react";
import { dateTimeToNanos } from "../../lib/datetime";
import { useArt } from "../../lib/hooks/useArt";
import useArtId from "../../lib/hooks/useArtId";
import { useHistory } from "../../lib/hooks/useHistory";
import { useStatus } from "../../lib/hooks/useStatus";
import { assetUrl } from "../../lib/url";
import Panel from "../Containers/Panel";
import { DevTools } from "../DevTools";
import { useMockData } from "../Store/Store";
import { Art002 } from "./002";
import { Art003 } from "./003";
import { Art004 } from "./004";

export default function Canvas() {
  const artId = useArtId();
  const art = useArt({ artId });
  const status = useStatus({ artId });
  const history = useHistory();
  const [mockData] = useMockData();
  const actualData = mockData.active ? mockData.art : art.data[1];
  const actualStatus = mockData.active ? mockData.status : status.data;
  const actualTransfers = mockData.active ? mockData.transfers : history.data;
  const actualNow = mockData.active
    ? mockData.now
    : dateTimeToNanos(DateTime.utc());

  return (
    <Panel className="p-8 w-full flex flex-col items-center">
      {artId === "0" && <img src={assetUrl("000.svg")} />}
      {artId === "1" && <img src={assetUrl("001.svg")} />}
      {artId === "2" && <Art002 data={actualTransfers} now={actualNow} />}
      {artId === "3" && <Art003 data={actualTransfers} />}
      {artId === "4" && (
        <Art004 owners={actualData} transfers={actualTransfers} />
      )}

      <DevTools />
    </Panel>
  );
}
