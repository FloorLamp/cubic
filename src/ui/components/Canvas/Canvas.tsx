import { DateTime } from "luxon";
import React from "react";
import { dateTimeToNanos } from "../../lib/datetime";
import { useDetails } from "../../lib/hooks/useDetails";
import { useHistory } from "../../lib/hooks/useHistory";
import useId from "../../lib/hooks/useId";
import { useStatus } from "../../lib/hooks/useStatus";
import { assetUrl } from "../../lib/url";
import Panel from "../Containers/Panel";
import { DevTools } from "../DevTools";
import { useMockData } from "../Store/Store";
import { Art003 } from "./003";
import { Art004 } from "./004";

export default function Canvas() {
  const id = useId();
  const art = useDetails({ id });
  const status = useStatus({ id });
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
      {id === "0" && <img src={assetUrl("000.svg")} />}
      {id === "1" && <img src={assetUrl("001.svg")} />}
      {id === "2" && <img src={assetUrl("002.svg")} />}
      {id === "3" && <Art003 data={actualTransfers} />}
      {id === "4" && <Art004 owners={actualData} transfers={actualTransfers} />}

      <DevTools />
    </Panel>
  );
}
