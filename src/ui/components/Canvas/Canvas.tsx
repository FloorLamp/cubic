import { DateTime } from "luxon";
import React from "react";
import { dateTimeToNanos } from "../../lib/datetime";
import { useHistory } from "../../lib/hooks/useHistory";
import useId from "../../lib/hooks/useId";
import { useOwners } from "../../lib/hooks/useOwners";
import { useSummary } from "../../lib/hooks/useSummary";
import Panel from "../Containers/Panel";
import { DevTools } from "../DevTools";
import { useMockData } from "../Store/Store";
import Asset from "./Asset";
import { Art003 } from "./Testing/003";
import { Art004 } from "./Testing/004";
import { Art005 } from "./Testing/005";

export default function Canvas() {
  const id = useId();
  const owners = useOwners({ id });
  const summary = useSummary({ id });
  const history = useHistory();
  const [mockData] = useMockData();
  const actualData = mockData.active ? mockData.art : owners.data;
  const actualStatus = mockData.active ? mockData.status : summary;
  const actualTransfers = mockData.active ? mockData.transfers : history.data;
  const actualNow = mockData.active
    ? mockData.now
    : dateTimeToNanos(DateTime.utc());

  return (
    <Panel className="p-8 w-full flex flex-col items-center">
      <Asset id={id} />
      {id === "3" && <Art003 data={actualTransfers} />}
      {id === "4" && <Art004 owners={actualData} transfers={actualTransfers} />}
      {id === "5" && (
        <Art005
          owners={actualData}
          transfers={actualTransfers}
          now={actualNow}
        />
      )}

      {process.env.NEXT_PUBLIC_DFX_NETWORK === "local" && <DevTools />}
    </Panel>
  );
}
