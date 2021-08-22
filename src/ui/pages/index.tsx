import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { BlocksTable } from "../components/BlocksTable";
import { CurrentStatus } from "../components/CurrentStatus";
import { DevTools } from "../components/DevTools";
import { useArt } from "../lib/hooks/useArt";

const CanvasContainer = dynamic(() => import("../components/Canvas"), {
  ssr: false,
});

export default function Home() {
  const art = useArt();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!data.length && art.data) {
      setData(art.data);
    }
  }, [art.data]);

  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <CanvasContainer data={data} />

      <CurrentStatus />

      <BlocksTable data={data} />

      <DevTools data={data} setData={setData} />
    </div>
  );
}
