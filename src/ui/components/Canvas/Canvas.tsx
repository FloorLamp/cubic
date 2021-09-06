import { DateTime } from "luxon";
import React from "react";
import { dateTimeToNanos } from "../../lib/datetime";
import { useDetails } from "../../lib/hooks/useDetails";
import { useHistory } from "../../lib/hooks/useHistory";
import useId from "../../lib/hooks/useId";
import { useStatus } from "../../lib/hooks/useStatus";
import Panel from "../Containers/Panel";
import { DevTools } from "../DevTools";
import { useMockData } from "../Store/Store";
import Asset from "./Asset";
import { Art003 } from "./Testing/003";
import { Art004 } from "./Testing/004";

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
      <Asset id={id} />
      {id === "3" && <Art003 data={actualTransfers} />}
      {id === "4" && <Art004 owners={actualData} transfers={actualTransfers} />}

      {process.env.NEXT_PUBLIC_DFX_NETWORK === "local" && <DevTools />}
    </Panel>
  );
}
