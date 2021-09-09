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
import { Triangles } from "./Testing/Triangles";

export default function Canvas() {
  const id = useId();
  const owners = useOwners({ id });
  const summary = useSummary({ id });
  const history = useHistory();
  const [mockData] = useMockData();
  const actualData = mockData.active ? mockData.art : owners.data;
  const actualStatus = mockData.active ? mockData.status : summary;
  const actualEvents = mockData.active ? mockData.events : history.data;
  const actualNow = mockData.active
    ? mockData.now
    : dateTimeToNanos(DateTime.utc());

  return (
    <Panel className="p-8 w-full flex flex-col items-center">
      <Asset id={id} />
      {id === "4" && <Triangles owners={actualData} events={actualEvents} />}

      {process.env.NEXT_PUBLIC_DFX_NETWORK === "local" && <DevTools />}
    </Panel>
  );
}
